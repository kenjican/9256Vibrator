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
      return "-";
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
    var v = JSON.parse(xmlhttp.response);
    document.getElementById('TPV').innerHTML = v.TPV;
    document.getElementById('TMV').innerHTML = v.TMV + " %";
    document.getElementById('HMV').innerHTML = v.HMV + " %";
    document.getElementById('HPV').innerHTML = v.HPV;
    document.getElementById('TSV').innerHTML = v.TSV;
    document.getElementById('HSV').innerHTML = v.HSV;
    document.getElementById('cycles').innerHTML = v.AllCycles;
    document.getElementById('steps').innerHTML = "第" + v.Steps + " 段";
    document.getElementById('patterns').innerHTML = "第" + v.Patterns + "组";
    document.getElementById('Timeleft').innerHTML = v.HourLeft + " 时 " + v.MinLeft + " 分 ";
    document.getElementById('Hz').innerHTML = v.Hz;
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
    //console.log(c);
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
      //hztbl.children[i].children[2].innerHTML = parseInt(c[i][2]);
      hztbl.children[i].children[2].innerHTML = parseInt(c[i][2].substr(0,3));

   }
 }
}
}

function insertrow(){
  var ir = document.getElementById('hztbl').children[1];
  ir.insertRow(-1);
  ir.setAttribute('contenteditable','true');
  ir.lastChild.setAttribute("style","height:50px");
  for(var i = 0;i<3;i++){
    ir.lastChild.insertCell(i);
}
}

function delrow(){
  document.getElementById('hztbl').children[1].deleteRow(-1);
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
      var zerolead = '000';
      cellarray.push(parseInt(x.children[i].children[0].innerHTML));
      cellarray.push(parseInt(x.children[i].children[1].innerHTML));
      //cellarray.push(x.children[i].children[2].innerHTML);
      zerolead = zerolead + x.children[i].children[2].innerHTML;
      if(parseInt(zerolead.substr(-3,3)) > 127) {
         alert('频率不得大于127');
         return;
        }
      cellarray.push(zerolead.substr(-3,3) + '00');
      //cellarray.push(getfs(zerolead.substr(-3,3)).toString());      
      hzarray.push(cellarray);
    } 
  } else {
    //alert("放弃");
  }

    console.log(hzarray);
    ajaxtest1('/hzsave',JSON.stringify(hzarray));
}

function getfs(a){
  var fs = '4';
  for(var i = 0; i <3 ; i++){
     fs = fs ^ a[i];
   }
  return fs;
}




function otchart(){
   var dt = new Date(0);
   var va = [];
   va[0] = (document.getElementById('TPV').innerHTML).toString();
   va[1] = document.getElementById('HPV').innerHTML;
   va[2] = document.getElementById('TSV').innerHTML;
   //va.push(document.getElementById('HPV').innerHTML);
   charData.setOption({
     xAxis:{data:dt},
     series:[
     {data:va[0]},
     {data:va[1]},
     {data:va[2]}
     ]
  });
}




function sched(){
  getvalue();
  //otchart();
}

var t2 = setInterval(sched,1000);
