/*
*alidayu SMS

TopClient = require( './topClient' ).TopClient;
var client = new TopClient({
   'appkey' : '23575073',
   'appsecret' : '98f4281e256bfdd0690c973d28c0d60f',
   'REST_URL' : 'http://gw.api.taobao.com/router/rest'
});

		        
client.execute( 'alibaba.aliqin.fc.sms.num.send' , {
   'extend' : '' ,
   'sms_type' : 'normal' ,
   'sms_free_sign_name' : '快递单号' ,
   'sms_param' : "{MNo:'マシン',diff:'45.5',max:'34.5',min:''}" ,
   'rec_num' : '13013786354' ,
   'sms_template_code' : "SMS_34910168"
   }, function(error, response) {
         if (!error) console.log(response);
         else console.log(error);
       });
*/
/*
*node mailer

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service:'qq',
  auth:{
    user:'3497767032@qq.com',
    pass:'qosnhknvpyvzcjih'
  }
});

var mailOptions = {
  from:'志禾精密电子<3497767032@qq.com>',
  to:'121813000@qq.com',
  subject:'nodemailテスト結果',
  html:'<h2>nodemailer no usage</h2>',
  attachments:[
    {
      filename:'test1.js',
      path:'./topUtil.js'
  }]
};

transporter.sendMail(mailOptions,function(err,info){
  if(err){
    console.log(err);
    return;
  }
  console.log('send successfully');
});

*/

/*
var http = require('http');
var qs = require('querystring');
var fs = require('fs');
var path = require('path');

var postdata = qs.stringify({
  'lan':'zh',
  'ie':'UTF-8',
  'spd':2,
  'text':'测试百度语音在诺德寄诶思'
});

var postdata = encodeURI('警报1通知工程师');
var options={
  //'method':'GET',
  'host':'tts.baidu.com',
  'path':'/text2audio?lan=zh&ie=UTF-8&spd=2&text=' + postdata
};

var req = http.request(options,function(res){
  var chunks =[];
  res.on('data',function(chunk){
    console.log('data in');
    chunks.push(chunk);
  });

  res.on('end',function(){
    var body = Buffer.concat(chunks);
    var filepath = path.normalize('./test.mp3');
    fs.writeFileSync(filepath,body);
  });
});
req.end();

*/



/*
var sp = require('serialport');
var fs = require('fs');
var U82x6 = require('./U82x6.js');
var U8256 = new U82x6('U8256');
sp.list(function(err,ports){
  ports.forEach(function(port){
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
    console.log(port.locationId);
    console.log(port.venderId);
    console.log(port.productId);
    console.log(port.deviceId);
  });
});
console.log(U8256.run);
console.log(U8256.stop);
console.log(U8256.getvalue);
console.log(U8256.steps);
*/

/*test cluster

var cluster = require('cluster');
var http = require('http');
var numcpus = require('os').cpus().length;
console.log(numcpus);
*/

/*
let Serialport = require('serialport');
Serialport.list(function(err,ports){
  ports.forEach(function(port){
    console.log(port.comName);
    console.log(port.pnpId);
    console.log(port.manufacturer);
    console.log(port.serialNumber);
    console.log(port.locationId);
    console.log(port.productId);
    console.log(port.vendorId);
  });
});
*/

const a = require('./serials.js');
let b = new Serials();
b.lists();
