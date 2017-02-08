"use strict"

const dns = require('dns');

function fetchIPv4(fQDN){

    const ipPromise = new Promise(function(resolve, reject){
        dns.resolve4(fQDN, function resolve4CB(err, adresses){
            if(err) reject(err);

            if(adresses.length > 1){
                resolve(adresses);

            } else {
                resolve(adresses);
            }
        });
    });

    return ipPromise;
}

function fetchMinTTL(fQDN){

    const ttlPromise = new Promise(function(resolve, reject){
        dns.resolveSoa(fQDN, function resolveSoaCB(err, adresses){
            if(err) reject(err);
            if(adresses.length > 1){
                resolve(adresses);
            } else {
                resolve(adresses);
            }
        })
        
    });

    return ttlPromise;
}

Promise.all([fetchIPv4('slack.com'), fetchMinTTL('slack.com')]).then(function(values){
    console.log(values);
    let resolvedObject = {
        ipv4: values[0],
        minTTL: values[1].minttl
    };
    console.log(resolvedObject);

}, function(err){
    if(err) console.log(err);
});
