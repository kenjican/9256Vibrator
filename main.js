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
const OYO = require('./OYOs.js');
const vibrator = require('./vibrators.js');

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
  switch (data.slice(3,5)){
  case '01':
    port1.write('@015145*\r');
    U825601.parseAna(data);
    break;
  case '51':
    U825601.parseDig(data);
    break;
  default:
    break;
  }
});

try {
port1.on('error',function(err){
  console.log(err);
});
}catch (e){
  console.log(e);
}
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


var jps01 = new vibrator('01').jps;

var U825601 = new OYO('01').U8256s;

/*
Intergrator , to cooridnate U8256 and Vibrator;
*/
/*
class Coordinator{
  constructor(){
    this.Hz = null;
    this.Steps = null;
  }

  getValue(){
    U825601.getValue();
    jps01.getHz();
    if(U825601.running){
       this.CheckCSHz();
    }else{
       if(jps01.Hz != '00000')
	  //console.log('not running');
	  jps01.setHz('00000');
       }
    }
   

   CheckCSHz(){
      //U825601.getValue();
      //jps01.getHz();
      //savemongo();
      if(U825601.running){
        if(this.Steps != U825601.Steps){
          this.Steps = U825601.Steps;
          for(let i = 0;i<Hztable01.Hzt.length;i++){
             if((U825601.NowPCycles == Hztable01.Hzt[i][0]) && (U825601.Steps == Hztable01.Hzt[i][1])){
	      // console.log(Hztable01.Hzt[i][2]);
	       jps01.setHz(Hztable01.Hzt[i][2]);
	       return false;
  	     }
           }
          jps01.setHz("00000");
	  //console.log('be set to zeon');
          }
    }else{
       //console.log('stopped');
         if(jps01.Hz !='00000'){
 	jps01.setHz('00000');
      }
     } 
       
      U825601.getValue();
      jps01.getHz();

   }  
}
*/
var Coordinator1 = new Coordinator();

class Hztable{
  constructor(){
    let table = JSON.parse(fs.readFileSync('config/vibrator.json','utf8'));
    var Hzt = new Array();
    this.Hzt = table.DZ.PCycles;
    table = null;
  } 

  reload(){
    let table01 = JSON.parse(fs.readFileSync('config/vibrator.json','utf8'));
    var Hzt = new Array();
    this.Hzt = table01.DZ.PCycles;
    //console.log(this.Hzt);
    table01 = null;
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

function savemongo(){
//  console.log("mongo get called");
  var uv = new UVData({data:[]});
  uv.data.push(U825601.TPV);
  uv.data.push(U825601.HPV);
  uv.data.push(U825601.TSV);
  uv.data.push(U825601.HSV);
  uv.data.push(parseInt(jps01.Hz)/100);
  uv.save();

}


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
  res.send(U825601.analogData + U825601.digitalData + jps01.Hz);
  res.end;
});
/*
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
  port1.write(setupjson.U8256.holds);
});
*/
app.post('/hzsave', function(req,res){
  var vfile = JSON.parse(fs.readFileSync('config/vibrator.json','utf8'));
  vfile.DZ.PCycles = req.body;
  console.log(vfile);
  fs.writeFile('config/vibrator.json',JSON.stringify(vfile),function(err){
     if(err) console.log(err);
    });
  //Hztable01.reload();
});

app.get('/gethis/:fDate/:tDate',function(req,res){
  UVData.find({'_id':{$gt:(req.params.fDate + '0000000000000000'),$lt:(req.params.tDate +'0000000000000000')}}).exec(function(err,his){
    if (err) throw err;
    res.send(his);
    res.end;
   });
 });


app.get('/tests/:hz',function(req,res){
  //port2.write('C,01,00\r');
     //port2.write(req.params.hz);
	jps01.setHz(req.params.hz);
//  res.send(setupjson.vibrator.Hz.length.toString(10));
//  res.end;
});


app.listen(8888);



/*
Scheduler, 1Hz
*/
function schd(){
  //console.log(jps01.Hz);
}


/*
Config system parameters
*/

app.get('/GetVibrator',function(req,res){
   //var getv = JSON.parse(fs.readFile('vibrator.json','utf8'));
   var getv = JSON.parse(fs.readFileSync('config/vibrator.json','utf8'));
   res.header('Content-Type','application/json');
   res.send(getv.DZ.PCycles);
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
/*
var t1 = setInterval(function(){
	Coordinator1.CheckCSHz();
	savemongo();
         },1000);
*/
//var t1 = setInterval(schd,1000);
//console.log(Hztable01.Hzt[1][2]);
