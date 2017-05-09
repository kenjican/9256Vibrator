class jps{
  constructor(mno){
    this.mno = mno;
    this.Hz = null;
  }

  getHz(){
     port2.write('R,01,57\r');
  }

  setHz(data){
     //console.log(data + 'setHz');
     port2.write('C,01,02,' + data + '\r');
  }

  parseValue(data){
     //console.log(data);
     this.Hz = data.split(',')[4];
     //console.log(this.Hz);
  }
}

module.exports = jps;

