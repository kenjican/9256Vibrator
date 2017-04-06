function U82x6(ModelName){
    var fs = require('fs');
    var paras = JSON.parse(fs.readFileSync('U8256.json','utf8'));
    this.run = paras.run;
    this.stop = paras.stop;
    this.steps = paras.steps;
    this.holds = paras.holds;
    this.getvalue = paras.GetValue
    fs = null;
    paras = null;
}

module.exports = U82x6;
