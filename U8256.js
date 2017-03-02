var xmlhttp;
xmlhttp = new XMLHttpRequest();
xmlhttpC = new XMLHttpRequest();

function calvalue(va){
   if(va < 32767) {
     return va;
  }else{
    va = va - 65536;
    if(va > -20000){
      return va;
   }else{
      return "---"
  }
}
}


function getvalue(){
  xmlhttp.open("GET","/getvalue",true);
  xmlhttp.responseType = "text";
  xmlhttp.send();
}

xmlhttp.onreadystatechange = function(){
  if(xmlhttp.readyState ===4 && xmlhttp.status ===200){
    var v = xmlhttp.response;
    document.getElementById('TPV').innerHTML = calvalue(parseInt(v.slice(5,9),16))/100;
    document.getElementById('TMV').innerHTML = parseInt(v.slice(66,68),16) + " %";
    document.getElementById('HMV').innerHTML = parseInt(v.slice(70,72),16) + " %";
    document.getElementById('HPV').innerHTML = calvalue(parseInt(v.slice(9,13),16))/100;
    document.getElementById('TSV').innerHTML = calvalue(parseInt(v.slice(13,17),16))/100;
    document.getElementById('cycles').innerHTML = "第" +( parseInt(v.slice(36,40),16) - parseInt(v.slice(40,44),16)) + "循环";
    document.getElementById('steps').innerHTML = "第" + parseInt(v.slice(29,33),16) + " 段";
    document.getElementById('patterns').innerHTML = "第" + parseInt(v.slice(33,35),16) + "组";
    document.getElementById('Timeleft').innerHTML = parseInt(v.slice(60,64),16) + " 时 " + parseInt(v.slice(64,66),16) + " 分 ";
    document.getElementById('TCR').innerHTML = parseInt(v.slice(68,70),16) + ' %';
    document.getElementById('HCR').innerHTML = parseInt(v.slice(72,74),16) + ' %';
    document.getElementById('Hz').innerHTML = parseInt(v.slice(89,92),10);
 }
}

function run(){
  xmlhttpC.open("GET",'/run',true);
  xmlhttpC.responseType = 'text';
  xmlhttpC.send();
}

function stop(){
  xmlhttpC.open("GET",'/stop',true);
  xmlhttpC.responseType = 'text';
  xmlhttpC.send();
}

function steps(){
  xmlhttpC.open("GET",'/steps',true);
  xmlhttpC.responseType = 'text';
  xmlhttpC.send();
}

function holds(){
  xmlhttpC.open("GET",'/holds',true);
  xmlhttpC.responseType = 'text';
  xmlhttpC.send();
}


var t2 = setInterval(getvalue,1000);
