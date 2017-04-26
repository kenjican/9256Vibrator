# 9256Vibrator , get the running cycles ,step status and make the vibtator run at specific Hz. Raspberry pi as the controller,connectiing to both 9256 and vibrator

problems entountered:

(1):serialport install failed
solution:
   sudo npm install serialport --unsafe-perm . Have to install in the projecr folder ,to intstalling global would produce require error.
   
(2): require express module ,failed
solution:
   sudo npm install express --save
   
(3):SyntaxError: missing ) after argument list
solution:
    It happens when read json file, the cause is that key should not start with a number like 9256 or 9226. Make the key's first charactar to be alphabet like U9256 or U9226.problem solved!!
 
(4):VIM no syntax color
solution:
   open ~/.vimrc (if not exists , create one) ,and add  syntax on in the .vimrc file.
   
(5):Unkonwn vibrator status,if it is vibrating at which frewuency?
solution:
   None. Ask vendor of vibrator.
 
(6):Error: Cannot find module 'mongoose' and Error: Cannot find module 'bluebird'
solution: Due to install global, module 'mongoose', 'bluebird' can not be found. Do this: sudo npm link mongoose  , and sudo npm link bluebird

(7): body-parser is needed for parse post json date. Have to install in local folder. sudo npm install --save body-praser
(a)browser uses JSON.stringify fucntion to conver array to json form
(b)server side, express's app config like this:
       app.use(bodyParser.json());
       app.use(bodyParser.urlencoded({extended:true}));
       
(8):echarts error message: invalid dom , due to initiallize echart before doucmnet loaded.
solution:
   Initialize echarts since document had beed loaded,,error message disappered.
(9):jQuery datetime picker layout is not adequate, replace with mobiscroll 2.6.1. Mobiscroller is more user friendely for mobile and tablet.

(10):ttyUSB is not always the same after rebooted.
solution:https://hallard.me/fixed-usb-dev-uteleinfo/ , but if customer replace with other USB-serial adapter,,,how to make the port number consistent?

(11):power supply, Speaker plug in USB port and extract power from respbery Pi ,,,the program died..
solution: DO NOT get power from raspberry. Use an isolate power supplyu for speaker.

(12):how to detect whether U8256,vibrator is power off? U8256 ,vibrator wont fire error even power is off
solution: might event once work? No,it's complex. Add a boolean to U8256.write and U8256.on('data',function) to varify if got data feedback

(13):3.5mm jack audio noise like 'hissss'
solution: no

(14): To fit all devices with different resoltuion,screen size
solution: responsive web design

(15):JPS inverter write parameters.The default setting is write-protect
soluton:
set Pr 95 to 00000, Pr 96 to 00001 ,then all the R/W FR/W could be changed.

(16):JPS PDAN-2022 Hz upper and lower limit is 06000 ,00300.How to change to 10000 ,00000. make the uppler limit 100Hz, lower limit 0 hz
solution: set Pr 15 to 10000 , Pr 16 to 00000

(17):JPS PDAN-2022 change the serial config to 19200,E,7,2
solution: W,01,93,00201
resotre to default config: W,00,93,00001
have to reboot.the communication parameters take effect

Idea:
(1)Seperate all the controller ,vibrator into single file. Setup.json is a configuration file for integrating all the parts.

(2) Make the best of human sensor,such as 眼耳鼻舌身意. Flash light or alarm color to attract attention. TTS voice to alert the present status or alert.mobile phone vibration to notice status.

(3) How to protect the program? encrypt the SD card? or provide the usb-serial port and fix the serial number of USB serial chip?

(4) Color Scheme: techonic , light , delight feeling..
