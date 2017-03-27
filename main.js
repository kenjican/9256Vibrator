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
Mongodb
*/

var db = mongoose.createConnection('localhost','U8256V');

var U8256Scm = new mongoose.Schema({
   data:[]
}); 

var UVData = db.model('UVData',U8256Scm);



/*
8256 serial port communication
*/
var U8256 = new serialP('/dev/U8256',{
  baudRate:setupjson.U8256.baudRate,
  dataBits:setupjson.U8256.dataBits,
  stopBits:setupjson.U8256.stopBits,
  parity:setupjson.U8256.parity,
  parser:serialP.parsers.readline('\r\n')
});


var DZVibrator = new serialP('/dev/vibrator',{
  baudRate:dzv.DZ.baudRate,
  dataBits:dzv.DZ.dataBits,
  stopBits:dzv.DZ.stopBits,
  parity:dzv.DZ.parity,
  parser:serialP.parsers.readline('\r\n')
});



function calvalue(va){
  if(va < 32767){
    return va;
  }else{
    va = va -65536;
    if (va > -20000){
       return va;
    }else{
       return '';
    }
  }
}


function U8256gv(){
  U8256.write(setupjson.U8256.GetValue);
  !UBool ? value = null:UBool = false;
}  

U8256.on('data',function(data){
  if(data.length > 15){
  var cyc;
  var ste;
  cyc = parseInt(data.slice(36,40),16) - parseInt(data.slice(40,44),16);
  ste = parseInt(data.slice(29,33),16);
  var hz = CheckCS(cyc,ste);
  
  value = data + hz;  
  
  var uv = new UVData({data:[]});
  uv.data.push(calvalue(parseInt(data.slice(5,9),16))/100);
  uv.data.push(calvalue(parseInt(data.slice(9,13),16))/100);
  uv.data.push(calvalue(parseInt(data.slice(13,17),16))/100);
  uv.data.push(calvalue(parseInt(data.slice(17,21),16))/100);
  uv.data.push(hz);
  uv.save();
  UBool = true;
  }
});

U8256.on('error',function(err){
  console.log(err);
});



/*
vibrator
*/

function VRun(hz){
 // console.log(hz.toString(10).length);
 //DZVibrator.write(
}

function CheckCS(cyc,ste){
  for(var i=0;i<dzv.DZ.Hz.length;i++){
   if((dzv.DZ.Hz[i][0]==cyc) && (dzv.DZ.Hz[i][1]==ste)){
     DZVibrator.write(dzv.DZ.Run + dzv.DZ.Hz[i][2] + dzv.DZ.Hz[i][3]);
     return dzv.DZ.Hz[i][2];
    }
  }
   DZVibrator.write("630005");
  return '000';
}

DZVibrator.on('error',function(err){
   console.log(err);
});

DZVibrator.on('data',function(err){
   console.log(err);
});

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
   //client.write(mbs);
   U8256gv();
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

var t1 = setInterval(schd,setupjson.scheduler);


