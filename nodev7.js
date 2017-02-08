const dns = require('dns');

// function fetchDNS(fQDN){
//     const options4 = {
//         ttl: true
//     };

//     dns.resolve4(fQDN, options4, function resolve4CB(err, result){
//         if(err){
//             throw err;
//         }
//         console.log(result)
//     });
// }

// fetchDNS('facebook.com')

dns.lookup('api.slack.com', function(err, addresses){
    if(err) throw err;
    console.log(addresses);
})
