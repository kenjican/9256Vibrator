var bodyParser = require('body-parser');
var fs = require('fs');
var setupjson = JSON.parse(fs.readFileSync('setup.json','utf8'));
var dzv = JSON.parse(fs.readFileSync('config/vibrator.json','utf8'));
var express = require('express');
var app = express();
var net = require('net');
var value;
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var serialP = require('serialport');
var UBool = false;
var VBool = false;

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
  U825601.parseValue(data);
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
   jsp01.parseValue(data);
});


/*
vibrator class
*/

class jsp{
  constructor(mno){
    this.mno = mno;
    this.Hz = null;
  }

  getHz(){
     port2.write('R,01,57\r');
  }

  setHz(data){
     port2.write('C,01,02,00500\r');
  }

  parseValue(data){
     console.log(data);
     this.Hz = data.split(',')[4].slice(0,3);
  }
}

var jsp01 = new jsp('01');

/*
U8256 class
*/

class U8256{
  constructor(mno){
    this.mno = mno;
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

  parseValue(data){
    //console.log(data);    
    this.TPV = this.calValue(parseInt(data.slice(5,9),16))/100;
    this.HPV = this.calValue(parseInt(data.slice(9,13),16))/100;
    this.TSV = this.calValue(parseInt(data.slice(13,17),16))/100;
    this.HSV = this.calValue(parseInt(data.slice(17,21),16))/100;
    this.Steps = parseInt(data.slice(29,33),16);
    this.Patterns = parseInt(data.slice(33,35),16);
    this.AllCycles = parseInt(data.slice(36,40),16);
    this.LeftCycles = parseInt(data.slice(40,44),16);
    this.TMV =  parseInt(data.slice(66,68),16);
    this.HMV = parseInt(data.slice(70,72),16);
  }


}

var U825601 = new U8256('01');

/*
Intergrator , to cooridnate U8256 and Vibrator;
*/

class Coordinator{
  getValue(){
    U825601.getValue();
    jsp01.getHz();
    //schd();
  } 

}

var Coordinator1 = new Coordinator();

/*
Mongodb
*/

var db = mongoose.createConnection('localhost','U8256V');

var U8256Scm = new mongoose.Schema({
data:[]
}); 

var UVData = db.model('UVData',U8256Scm);



/*
function CheckCS(cyc,ste){
  for(var i=0;i<dzv.DZ.Hz.length;i++){
   if((dzv.DZ.Hz[i][0]==cyc) && (dzv.DZ.Hz[i][1]==ste)){
     //DZVibrator.write(dzv.DZ.Run + dzv.DZ.Hz[i][2] + "\r");
     return dzv.DZ.Hz[i][2];
    }
  }
   DZVibrator.write("C,01,00,00000\r");
  return '000';
}

DZVibrator.on('data',function(data){
   console.log(data);
   let a = data.split(",");
   jsp01.Hz =a[4].slice(0,3);
   console.log(jsp01.Hz);
});
*/

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
  res.send(value);
  res.end;
});

app.get('/run',function(req,res){
  U8256.write(setupjson.U8256.run);
});

app.get('/stop',function(req,res){
  U8256.write(setupjson.U8256.stop);
});

app.get('/steps',function(req,res){
  U8256.write(setupjson.U8256.steps);
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

  for(let keys in U825601){
      console.log(keys + ": " + U825601[keys]);
  }
  
  for(let keys in jsp01){
      console.log(keys + ": " + jsp01[keys]);
  }
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

var t1 = setInterval(Coordinator1.getValue,1000);


