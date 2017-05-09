class alidayu(){
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
}
