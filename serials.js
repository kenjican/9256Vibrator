const serialp = require('serialport');
const fs = require('fs');

class Serials{
  constructor(){
  this.serialconfig = JSON.parse(fs.readFileSync('./serials.json','utf8'));
  }


  init(){
    serialp.list(function(err,ports){
    ports.forEach(function(port){
      if (typeof port.serialNumber != 'undefined'){
        for(let keys in serialconfig){
	  if(port.serialNumber == serialconfig[keys].serialNumber){
             this.serialconfig[keys] = new serialp(port.comName,{
	       baudRate:serialconfig[keys].baudRate,
               dataBits:serialconfig[keys].dataBits,
               stopBits:serialconfig[keys].stopBits,
               parity:serialconfig[keys].parity,
               parser:serialconfig[keys].readline('\r\n')
	     });
	  }	     
//    console.log(port.serialNumber);
//    console.log(port.comName);
      }
      }
    });
  });
  }
}

module.exports = Serials;
