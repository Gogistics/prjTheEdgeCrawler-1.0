var geoip = require('geoip-lite');

var ip = "59.47.0.150";
var geo = geoip.lookup(ip);

console.log(geo);