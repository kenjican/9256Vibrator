class U8256s{
  constructor(mno){
    this.mno = mno;
    this.analogData = '';
    this.digitalData = '';
    this.getValue = '@010140*\r\n';
  }
/*
  getValue(){
     //port1.write(setupjson.U8256.GetValue);
    Serials.port1.write('@010140*\r\n');   
  }  
*/
  calValue(va){
     if(va < 32767) {
       return va;
     }else{
       va = va - 65536;
       if(va > -20000){
         return va;
      }else{
      return "-";
      }
    }
  }

  parseAna(data){
    this.analogData = data.slice(5,74);    
    this.TPV =  this.calValue(parseInt(data.slice(5,9),16))/100;
    this.HPV = this.calValue(parseInt(data.slice(9,13),16))/100;
    this.TSV = this.calValue(parseInt(data.slice(13,17),16))/100;
    this.HSV = this.calValue(parseInt(data.slice(17,21),16))/100;
    this.Steps = parseInt(data.slice(29,33),16);
    this.Patterns = parseInt(data.slice(33,35),16);
    this.NowPCycles =  parseInt(data.slice(44,48),16) - parseInt(data.slice(48,52),16);
  }

  parseDig(data){
    this.digitalData = data.slice(5,17);
    this.status = this.digitalData.slice(0,4);
    if(this.status == '0001' || this.status == '0011'){
	this.running = true;
    }else{
	this.running = false;
    }
  }

}

module.exports = {U8256s};
