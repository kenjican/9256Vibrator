class Coordinator{
  constructor(){
    this.Hz = null;
    this.Steps = null;
  }

  getValue(){
    U825601.getValue();
    jps01.getHz();
    if(U825601.running){
       this.CheckCSHz();
    }else{
       if(jps01.Hz != '00000')
	  //console.log('not running');
	  jps01.setHz('00000');
       }
    }
   

   CheckCSHz(){
      //U825601.getValue();
      //jps01.getHz();
      //savemongo();
      if(U825601.running){
        if(this.Steps != U825601.Steps){
          this.Steps = U825601.Steps;
          for(let i = 0;i<Hztable01.Hzt.length;i++){
             if((U825601.NowPCycles == Hztable01.Hzt[i][0]) && (U825601.Steps == Hztable01.Hzt[i][1])){
	      // console.log(Hztable01.Hzt[i][2]);
	       jps01.setHz(Hztable01.Hzt[i][2]);
	       return false;
  	     }
           }
          jps01.setHz("00000");
	  //console.log('be set to zeon');
          }
    }else{
       //console.log('stopped');
         if(jps01.Hz !='00000'){
 	jps01.setHz('00000');
      }
     } 
       
      U825601.getValue();
      jps01.getHz();

   }  
}

