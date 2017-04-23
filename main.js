var bodyParser = require('body-parser');
var fs = require('fs');
var setupjson = JSON.parse(fs.readFileSync('setup.json','utf8'));
var dzv = JSON.parse(fs.readFileSync('config/vibrator.json','utf8'));
var express = require('express');
var app = express();
var net = require('net');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var serialP = require('serialport');

/*
USB Serial port
*/
var port1 = new serialP('/dev/ttyUSB0',{
  baudRate:setupjson.U8256.baudRate,
  dataBits:setupjson.U8256.dataBits,
  stopBits:setupjson.U8256.stopBits,
  parity:setupjson.U8256.parity,
  parser:serialP.parsers.readline('\r\n')
});

port1.on('data',function(data){
  //U825601.parseValue(data);
  U825601.parseJson(data);
});

port1.on('error',function(err){
  console.log(err);
});

var port2 = new serialP('/dev/ttyUSB1',{
  baudRate:dzv.DZ.baudRate,
  dataBits:dzv.DZ.dataBits,
  stopBits:dzv.DZ.stopBits,
  parity:dzv.DZ.parity,
  parser:serialP.parsers.readline('\r')
});

port2.on('data',function(data){
   jps01.parseValue(data);
});

port2.on('error',function(err){
   console.log(err);
});

/*
vibrator class
*/

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

var jps01 = new jps('01');

/*
U8256 class
*/

class U8256{
  constructor(mno){
    this.mno = mno;
    this.status = {};
  }

  getValue(){
     port1.write(setupjson.U8256.GetValue);
  }  

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
/*
  parseValue(data){
    this.alldata = data;    
    this.TPV = this.calValue(parseInt(data.slice(5,9),16))/100;
    this.HPV = this.calValue(parseInt(data.slice(9,13),16))/100;
    this.TSV = this.calValue(parseInt(data.slice(13,17),16))/100;
    this.HSV = this.calValue(parseInt(data.slice(17,21),16))/100;
    this.Steps = parseInt(data.slice(29,33),16);
    this.Patterns = parseInt(data.slice(33,35),16);
    this.AllCycles = parseInt(data.slice(36,40),16);
    this.LeftCycles = parseInt(data.slice(40,44),16);
    this.AllPCycles= parseInt(data.slice(44,48),16);
    this.NowPCycles = this.AllPCycles - this.LeftPCycles;
    this.LeftPCycles = parseInt(data.slice(48,52),16);
    this.TMV =  parseInt(data.slice(66,68),16);
    this.HMV = parseInt(data.slice(70,72),16);
  }
*/
  parseJson(data){
    this.status.TPV = this.calValue(parseInt(data.slice(5,9),16))/100;
    this.status.HPV = this.calValue(parseInt(data.slice(9,13),16))/100;
    this.status.TSV = this.calValue(parseInt(data.slice(13,17),16))/100;
    this.status.HSV = this.calValue(parseInt(data.slice(17,21),16))/100;
    this.status.Steps = parseInt(data.slice(29,33),16);
    this.status.Patterns = parseInt(data.slice(33,35),16);
    this.status.AllCycles = parseInt(data.slice(36,40),16);
    this.status.LeftCycles = parseInt(data.slice(40,44),16);
    this.status.AllPCycles= parseInt(data.slice(44,48),16);
    this.status.LeftPCycles = parseInt(data.slice(48,52),16);
    this.status.HourLeft = parseInt(data.slice(60,64),16);
    this.status.NowPCycles = this.status.AllPCycles - this.status.LeftPCycles;
    this.status.MinLeft = parseInt(data.slice(64,66),16);
    this.status.TMV =  parseInt(data.slice(66,68),16);
    this.status.HMV = parseInt(data.slice(70,72),16);
    this.status.Hz = jps01.Hz;

  }

}

var U825601 = new U8256('01');

/*
Intergrator , to cooridnate U8256 and Vibrator;
*/

class Coordinator{
  constructor(){
    this.Hz = null;
    this.Steps = null;
  }

  getValue(){
    U825601.getValue();
    jps01.getHz();
    schd();
  } 

  CheckCSHz(){
    if (this.Steps == U825601.status.Steps){
      U825601.getValue();
      jps01.getHz();
      schd();
    }else{
      this.Steps = U825601.status.Steps;
      console.log(U825601.status.NowPCycles);
      for(let i = 0;i<Hztable01.Hzt.length;i++){
        if((U825601.status.NowPCycles == Hztable01.Hzt[i][0]) && (U825601.status.Steps == Hztable01.Hzt[i][1])){
	   //console.log(Hztable01.Hzt[i][2]);
	   jps01.setHz(Hztable01.Hzt[i][2]);
	   return false;
  	}
	}
      jps01.setHz('00000');
      U825601.getValue();
      jps01.getHz();
      schd();
    }
    }
  
}

var Coordinator1 = new Coordinator();

class Hztable{
  constructor(){
    let table = JSON.parse(fs.readFileSync('config/coordinator.json','utf8'));
    var Hzt = new Array();
    this.Hzt = table.PCycles;
    table = null;
  }
}

var Hztable01 = new Hztable();

/*
Mongodb
*/

var db = mongoose.createConnection('localhost','U8256V');

var U8256Scm = new mongoose.Schema({
data:[]
}); 

var UVData = db.model('UVData',U8256Scm);




/*
Web server
*/

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){
  res.sendFile('/home/ubuntu/9256Vibrator/index.htm');
});

app.get('/getvalue',function(req,res){
  res.send(U825601.status);
  //console.log(U825601.alldata);
  res.end;
});

app.get('/run',function(req,res){
  port1.write(setupjson.U8256.run);
});

app.get('/stop',function(req,res){
  port1.write(setupjson.U8256.stop);
});

app.get('/steps',function(req,res){
  port1.write(setupjson.U8256.steps);
});

app.get('/holds',function(req,res){
  U8256.write(setupjson.U8256.holds);
});

app.post('/hzsave', function(req,res){
  var vfile = JSON.parse(fs.readFileSync('config/vibrator.json','utf8'));
  vfile.DZ.Hz = req.body;
  fs.writeFile('config/vibrator.json',JSON.stringify(vfile),function(err){
     if(err) console.log(err);
    }
);
 // console.log(req.body);
});

app.get('/gethis/:fDate/:tDate',function(req,res){
  UVData.find({'_id':{$gt:(req.params.fDate + '0000000000000000'),$lt:(req.params.tDate +'0000000000000000')}}).exec(function(err,his){
    if (err) throw err;
    res.send(his);
    res.end;
   });
 });


app.get('/tests',function(req,res){
  res.send(setupjson.vibrator.Hz.length.toString(10));
  res.end;
});


app.listen(8888);



/*
Scheduler, 1Hz
*/
function schd(){
  console.log(jps01.Hz);
}


/*
Config system parameters
*/

app.get('/GetVibrator',function(req,res){
   //var getv = JSON.parse(fs.readFile('vibrator.json','utf8'));
   var getv = JSON.parse(fs.readFileSync('config/vibrator.json','utf8'));
   //console.log(getv.DZ.Hz);
   res.header('Content-Type','application/json');
   res.send(getv.DZ.Hz);
   res.end;  
}
);
/*
setTimeout(function(){
port2.write('W,01,15,15000\r');
port2.write('W,01,16,00000\r');
},5000);
*/
//setTimeout(function(){jps01.setHz('00000')},5000);
var t1 = setInterval(Coordinator1.CheckCSHz,1000);
//var t1 = setInterval(schd,1000);
//console.log(Hztable01.Hzt[1][2]);
