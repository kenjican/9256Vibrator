/*
9256 modbus TCP connection and communication


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
 values.push(data.readUInt16BE(50));



});

*/

