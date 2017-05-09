const serialp = require('serialport');

class Serials extends serialp{
  constructor(){
  
  }
  
  let lists = serialp.list(function(err,ports){
    ports.forEach(function(port){
      console.log(port.serialNumber);
      console.log(port.comName);
    }
  }
}

module.exports = Serials;
