//var xmlhttp;
var xmlhttp = new XMLHttpRequest();
var xmlhttpC = new XMLHttpRequest();

function calvalue(va){
   if(va < 32767) {
     return va;
  }else{
    va = va - 65536;
    if(va > -20000){
      return va;
   }else{
      return "---";
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


xmlhttpC.onreadystatechange = function(){
  if(xmlhttpC.readyState === 4 && xmlhttpC.status ===200){
     var v = xmlhttpC.response;
    document.getElementById('vhz').innerHTML = v;
    } 
}


function ajaxtest(url,datatype){
  var a = new XMLHttpRequest();
  a.open("GET",url,true);
  a.responseType = datatype;
  a.send();
  return a;
}

function ajaxtest1(url,data){
  var a = new XMLHttpRequest();
  a.open("POST",url);
  a.setRequestHeader("content-Type","application/json");
  a.send(data);
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

//var modal = document.getElementById('vbModal');

function hzsetup(){
  document.getElementById('vbModal').style.display = "block";
/*
  xmlhttpC.open('GET','/GetVibrator',true);
  xmlhttpC.responseType = 'text';
  xmlhttpC.send();
*/
  var hztbl = document.getElementById('hztbl').children[1];
  while(hztbl.firstChild){
     hztbl.removeChild(hztbl.firstChild);
   }
  var a = ajaxtest('/GetVibrator','json');
  a.onreadystatechange = function(){
  if(a.readyState === 4 && a.status ===200){
    var c = a.response;
    var b = a.response.length;
    for(var i = 0; i < b; i++){
      hztbl.insertRow();
      hztbl.children[i].setAttribute('contenteditable',true);
      hztbl.children[i].setAttribute('type','number');
      
      hztbl.children[i].insertCell();
      hztbl.children[i].insertCell();
      hztbl.children[i].insertCell();

      hztbl.children[i].children[0].innerHTML = c[i][0];
      hztbl.children[i].children[1].innerHTML = c[i][1];
      hztbl.children[i].children[2].innerHTML = parseInt(c[i][2]);

   }
 }
}
}

function insertrow(){
  var ir = document.getElementById('hztbl').insertRow(-1);
  ir.setAttribute('contenteditable','true');
  for(var i = 0;i<3;i++){
    ir.insertCell(i);
}
}

function delrow(){
  document.getElementById('hztbl').deleteRow(-1);
}

window.onclick = function(event){
  if(event.target == document.getElementById('vbModal')){
     document.getElementById('vbModal').style.display = 'none';
}
}

function hzsave(){
  if(confirm("确认保存目前设定?")){
    var x = document.getElementById('hztbl').children[1]; 
    var y = x.childElementCount;
    var hzarray = []; 
    for(var i = 0; i < y; i++){
      var cellarray = [];
      cellarray.push(parseInt(x.children[i].children[0].innerHTML));
      cellarray.push(parseInt(x.children[i].children[1].innerHTML));
      cellarray.push(x.children[i].children[2].innerHTML);
      hzarray.push(cellarray);
    } 
  } else {
    alert("放弃");
  }

    console.log(hzarray);
    ajaxtest1('/hzsave',JSON.stringify(hzarray));
}

var t2 = setInterval(getvalue,1000);
