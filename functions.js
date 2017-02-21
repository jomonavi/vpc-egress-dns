"use strict"

const dns = require('native-dns');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

function resolveIPv4(fQDN){

    let resolvedPromise = new Promise(function(resolve, reject) {
        const question = dns.Question({
            name: fQDN,
            type: 'A'
        });

        let start = Date.now(),
            req = dns.Request({
                question: question,
                server: {address: '8.8.8.8', type: 'udp'}
            });

        req.on('timeout', function(){
            console.log("Timeout in making request");
            reject('Timeout in making request');
        });

        req.on('message', function(err, answer){
            if(err) reject(err);
            let resolveAnswer = answer.answer[0],
                record = {
                    ipv4: resolveAnswer.address,
                    ttl: resolveAnswer.ttl
                }

            resolve(resolveAnswer);
        });

        req.on('end', function () {
          let delta = (Date.now()) - start;
          console.log('Finished processing request: ' + delta.toString() + 'ms');
        });

        req.send();
    });

    return resolvedPromise;
}

function fetchState(resolvedIP){
    let params = {
        Bucket: 'jc-vpc-egress-dns',
        Key: resolvedIP.name,

    }

    s3.getObject(params, function(err, data){
        if(err) {
            console.log("error \n", err, err.stack);
        } else {
            console.log("data \n", Date.now(data.Expires), data);
            checkState(data, resolvedIP)

        }
    })
}

function checkState(s3State, newState){
    let oldExpiration = JSON.parse(s3State.Body.toString()).expires,
        isStale = Date.now() > oldExpiration;
    if(isStale){
        setState(newState);
    } else {
        return null;
    }
}

function setState(resolvedIP){
    let ttlExpireTime = (Date.now() + (resolvedIP.ttl * 1000));
    resolvedIP.expires = ttlExpireTime
    let params = {
        Bucket: 'jc-vpc-egress-dns',
        Key: resolvedIP.name,
        Body: JSON.stringify(resolvedIP),
        Expires: (ttlExpireTime / 1000)
    }

    console.log(params)

    s3.putObject(params, function(err, data){
        if(err) console.log(err, err.stack);
        else console.log("success \n", data);
    });
}

exports.resolveIPv4 = resolveIPv4;
exports.fetchState = fetchState;
exports.checkState = checkState;
exports.setState = setState;