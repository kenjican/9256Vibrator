
//var chart = document.getElementById('chart');
var charData = {};//echarts.init(chart);
$(document).ready(function(){
//  $('#fDate').datetimepicker({
//  timeFormat:'HH:mm:ss' 
//  });
//  $('#tDate').datetimepicker({
//   timeFormat:'HH:mm:ss',
//  });

$('#fDate').mobiscroll({
   preset:'datetime',
   theme:'defaule',
   lang:'zh',
   mode:'scroller',
   display:'modal',
   dateFormat:'yyyy-mm-dd',
   setText:'确定',
   cancelText:'取消',
   dayText:'日',
   monthText:'月',
   yearText:'年',
   startYear:'2017',
   endYear:'2037',
   showNow:true

});
$('#tDate').mobiscroll({
   preset:'datetime',
   //theme:'ios',
   lang:'zh',
   mode:'scroller',
   display:'modal',
   dateFormat:'yyyy-mm-dd',
   setText:'确定',
   cancelText:'取消',
   dayText:'日',
   monthText:'月',
   yearText:'年',
   startYear:'2017',
   endYear:'2037',
   showNow:true
});

var chart = document.getElementById('chart');
charData = echarts.init(chart);
charData.setOption({
//title:{
//  text:'温湿振动'
//	},

toolbox:{
  feature:{
    dataZoom:{
      yAxisIndex:'none'
    },
    restore:{},
    mark:{show:true},
    saveAsImage:{},
    dataView:{}
  }
},

tooltip:{
  trigger:'axis'
},


dataZoom:[
  {
   type:'slider',
   xAxisIndex:0,
   start:0,
  end:100
  },
  {
    type:'inside',
    xAxisIndex:0,
    start:0,
    end:25
  },
  {
    type:'slider',
    yAxisIndex:0,
    start:0,
    end:100
  },
  {
    type:'inside',
    yAxisIndex:0,
    start:0,
    end:100
  }
],
legend:{
  data:[{
   name:'温度PV',
   textStyle:{
        color:'#ff0000'
   }},
   {name:'湿度PV',
   textStyle:{
        color:'#000080'
   }},
   {name:'温度SV',
   textStyle:{
         color:'#ff0000'
   }},
   {name:'湿度SV',
    textStyle:{
         color:'#000080'
   }},
   {name:'震动Hz'
   }]
},


xAxis:{
  type:'category',
  axisTick:{
    alignWithLabel:true
  },
  data:[]
},
yAxis:[{
  type:'value',
  name:'温度 C',
  position:'left',
  axisLabel:{
    formatter:'{value} °C '
  }},
  {
  type:'value',
  name:'湿度 %',
  min:0,
  max:100,
  position:'right',
  axisLabel:{
    formatter:'{value} %'
  }
  },
  {
  type:'value',
  name:'频率 Hz',
  position:'right',
  min:0,
  max:127,
  offset:40,
  axisLabel:{
    formatter:'{value} Hz'
  }
  }
],

series:[
{name:'温度PV',
type:'line',
itemStyle:{
  normal:{
    lineStyle:{
      color:'#ff0000'
    }
  }
},
data:[]
},
{name:'湿度PV',
 type:'line',
 yAxisIndex:1,
 itemStyle:{
  normal:{
    lineStyle:{
      color:'#000080'
    }
  }
},
//symbol:'dashed',
 data:[]
},
{name:'温度SV',
 type:'line',
 itemStyle:{
   normal:{
     lineStyle:{
        type:'dashed',
        color:'#ff0000'
      }
   }
 },
 data:[]
},
{name:'湿度SV',
 type:'line',
 yAxisIndex:1,
 itemStyle:{
   normal:{
     lineStyle:{
       type:'dashed',
       color:'#000080'
     }
   }
 },
 data:[]
},
{name:'震动Hz',
 type:'bar',
 yAxisIndex:2,
 data:[]
 }
]
});
});

function gethis(){
  if($('#fDate').val() != '' && $('#tDate').val() != ''){
  charData.showLoading();
  var a = new Date($('#fDate').val());
  var b = new Date($('#tDate').val());
  gethistory('gethis/' + (a.getTime()/1000).toString(16) + '/' + (b.getTime()/1000).toString(16));
  }else{
  alert("开始和结束时间不得为空白，请输入");
  
  }
}

function gethistory(ftdate){
  $.get(ftdate,function(da,status){
     charData.hideLoading();
     var dt = new Date(0);
     var dat =[];
     var tpv=[],hpv=[],tsv=[],hsv=[],vhz=[];
     var dl = da.length;
     for (var i =0; i < dl;i++){
        dt.setTime(parseInt((da[i]._id).slice(0,8),16)*1000);
        dat[i] = dt.toLocaleString();
        tpv[i] = da[i].data[0];
        hpv[i] = da[i].data[1];
        tsv[i] = da[i].data[2];
        hsv[i] = da[i].data[3];
        vhz[i] = parseInt(da[i].data[4]);
        }

     charData.setOption({
        xAxis:{data:dat},
        series:[
          {data:tpv},
          {data:hpv},
          {data:tsv},
          {data:hsv},
          {data:vhz}
          ]});

       });
}
          
