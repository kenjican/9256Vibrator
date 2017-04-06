var sp = require('serialport');
var fs = require('fs');
var U82x6 = require('./U82x6.js');
var U8256 = new U82x6('U8256');
/*
sp.list(function(err,ports){
  ports.forEach(function(port){
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
    console.log(port.locationId);
    console.log(port.venderId);
    console.log(port.productId);
    console.log(port.deviceId);
  });
});
*/
console.log(U8256.run);
console.log(U8256.stop);
console.log(U8256.getvalue);
console.log(U8256.steps);
