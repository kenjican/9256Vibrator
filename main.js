var fs = require('fs');
var setupjson = JSON.parse(fs.readFileSync('setup.json','utf8'));
var express = require('express');
var app = express();
var net = require('net');
var value;
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var serialP = require('serialport');


/*
Mongodb
*/

var db = mongoose.createConnection('localhost','U9256V');

var USchema = new mongoose.Schema({
   data:[]
}); 

var UVC = db.model('UVC',USchema);

/*
9256 modbus TCP connection and communication
*/

var mbs = new Buffer(setupjson.U9256.GetValue,'hex');
var client = new net.Socket();

client.connect(setupjson.U9226.port,setupjson.U9226.ip,function(){

});

client.on('error',function(err){
   console.error(err.code);
});

function calvalue(v){
   return (v - 65536);
}


client.on('data',function(data){
 var values = [];

 if(data.readUInt16BE(10) < 32767){
   values.push(data.readUInt16BE(10)/10);
 }
 else{
   values.push(calvalue(data.readUInt16BE(10))/10);
 }

 values.push(data.readUInt16BE(14)/10);
 values.push(data.readUInt16BE(16)/10);

 if(data.readUInt16BE(18) < 32767){
   values.push(data.readUInt16BE(18)/10);
 }
 else{
   values.push(calvalue(data.readUInt16BE(18))/10);
 }

 values.push(data.readUInt16BE(22)/10);
 values.push(data.readUInt16BE(24)/10);

 if(data.readUInt16BE(26) < 32767){
   values.push(data.readUInt16BE(26)/10);
 }
 else{
   values.push(calvalue(data.readUInt16BE(26))/10);
 }

 values.push(data.readUInt16BE(30)/10);
 values.push(data.readUInt16BE(32)/10);

 values.push(data.readUInt16BE(34));
 values.push(data.readUInt16BE(36));
 values.push(data.readUInt16BE(38));
 values.push(data.readUInt16BE(40));
 values.push(data.readUInt16BE(42));
 values.push(data.readUInt16BE(46));
 gvalues.push(data.readUInt16BE(50));



});

/*
8256 serial port communication
*/

var U8256 = new serialP('/dev/ttyUSB0',{
  baudRate:setupjson.U8256.baudRate,
  dataBits:setupjson.U8256.dataBits,
  stopBits:setupjson.U8256.stopBits,
  parity:setupjson.U8256.parity,
  parser:serialP.parsers.readline('\r\n')
});

function U8256gv(){
  U8256.write(setupjson.U8256.GetValue);
}  

U8256.on('data',function(data){
  value = data;  
});




/*
vibrator
*/

function VRun(hz){
  console.log(hz.toString(10).length);
}




/*
Web server
*/

app.use(express.static(__dirname));


app.get('/',function(req,res){
  res.sendFile('/home/pi/9256Vibrator/index.htm');
});

app.get('/getvalue',function(req,res){
  res.send(value);
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

var t1 = setInterval(schd,setupjson.scheduler);


