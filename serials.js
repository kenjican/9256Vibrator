const serialp = require('serialport');
const fs = require('fs');

function Serials(){
 // this.port1 = null;
 //this.serialconfig = JSON.parse(fs.readFileSync('./serials.json'));
}

Serials.prototype.port1 = null;
Serials.prototype.serialconfig = JSON.parse(fs.readFileSync('./serials.json'));


Serials.prototype.init = function(){
  serialp.list(function(err,ports){
    ports.forEach(function(port){
      if(typeof port.serialNumber != 'undefined'){
       Serials.prototype.binding(port.serialNumber,port.comName); 
      }
  });
});
};

Serials.prototype.binding = function(seri,comnam){
  this.port1 = new serialp(comnam,{
	       baudRate:this.serialconfig.port1.baudRate,
               dataBits:this.serialconfig.port1.dataBits,
               stopBits:this.serialconfig.port1.stopBits,
               parity:this.serialconfig.port1.parity,
               parser:serialp.parsers.readline('\r\n')
	     });

};


module.exports = Serials;

/*
class Serials{
  constructor(){
  this.serialconfig = JSON.parse(fs.readFileSync('./serials.json','utf8'));
  this.port =[];
/*  serialp.list(function(err,ports){
     //this.ports = ports;
    if(err){console.log(err)}
    this.parseports(ports);
    //console.log(typeof ports[2].comName);
    //this.port1 = ports[2].comName;
    //this.port1 = 'fesfd';
  });
  }

  static parseports(ports){
    this.port = ports;
    console.log(this.port);
  }

  init(){
    serialp.list(function(err,ports){
      console.log(ports);
      let port =  ports;
      //setTimeout(this.port = ports[2].comName,2000);
      //gthis.parseports(ports);
    });
//    console.log(this.serialconfig);
/*    serialp.list(function(err,ports){
    ports.forEach(function(port){
      if (typeof port.serialNumber != 'undefined'){
            //console.log(port.serialNumber);
	    this.port1 = new serialp(port.comName,{
	       baudRate:this.serialconfig.port1.baudRate,
               dataBits:this.serialconfig.port1.dataBits,
               stopBits:this.serialconfig.port1.stopBits,
               parity:this.serialconfig.port1.parity,
               parser:this.serialconfig.port1.readline('\r\n')
	     });

      }
	     
        for(let keys in this.serialconfig){
		console.log(keys);
	  if(port.serialNumber == this.serialconfig[keys].serialNumber){
	     //console.log(keys);
             this.serialconfig[keys] = new serialp(port.comName,{
	       baudRate:serialconfig[keys].baudRate,
               dataBits:serialconfig[keys].dataBits,
               stopBits:serialconfig[keys].stopBits,
               parity:serialconfig[keys].parity,
               parser:serialconfig[keys].readline('\r\n')
	     });
	     
	  	     
//    console.log(port.serialNumber);
//    console.log(port.comName);
      
      
//    });
//  });
//  }
}

module.exports = {Serials};
*/
