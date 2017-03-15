(function(){
  angular.module('App.services').service('mathServ', mathServ);

  function mathServ(){
    this.abs = abs;
    this.min = min;
    this.max = max;
    this.pow = pow;
    this.compare = compare;

    function abs(i){
      return (i < 0)?-i:i;
    }
    function min(a, b){
      return (a < b)?a:b;
    }
    function max(a, b){
      return (a < b)?b:a;
    }
    function pow(d, u){
      if(d == 0){
        return 0;
      }
      if(d == 1){
        return 1;
      }
      if(u == 0){
        return 1;
      }
      if(u == 1){
        return d;
      }
      if(u % 2 == 0){
        var t = pow(d, u / 2);
        return t * t;
      }else{
        return pow(d, u-1) * d;
      }
    }
    function compare(a, b){
      return (a > b)?1:(a == b)?0:-1;
    }
  }
})();
