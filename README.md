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


Idea:
(1)Seperate all the controller ,vibrator into single file. Setup.json is a configuration file for integrating all the parts.

(2) Make the best of human sensor,such as 眼耳鼻舌身意. Flash light or alarm color to attract attention. TTS voice to alert the present status or alert.mobile phone vibration to notice status.
