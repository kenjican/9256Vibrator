# 9256Vibrator ， get the running cycles ,step status and make the vibtator run at specific Hz. Raspberry pi as the controller,connectiing to both 9256 and vibrator

problems entountered:

(1):serialport install failed
solution:
   sudo npm install -g serialport --unsafe-perm

(2): require express module ,failed
solution:
   sudo npm install express --save
   
(3):SyntaxError: missing ) after argument list
solution:
    It happens when read json file, the cause is that key should not start with a number like 9256 or 9226. Make the key's first charactar to be alphabet like U9256 or U9226.problem solved!!
 
(4):VIM no syntax color
solution:
   open ~/.vimrc (if not exists , create one) ,and add  syntax on in the .vimrc file.
   
