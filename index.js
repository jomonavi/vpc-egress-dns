"use strict"

console.log("Loading functions.");

const myModule = require('./functions.js');
console.log(myModule);

myModule.resolveIPv4('google.com').then(function(res){
    console.log(res);
    myModule.fetchState(res);
}, function(err){
    if(err) throw err;
});
