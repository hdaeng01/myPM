(function(){
  angular.module('App.services').service('dateServ', [dateServ]);

  function dateServ(){
    this.getDaysInMonth = getDaysInMonth;
    this.getWeekCnt = getWeekCnt;
    this.dayNames = dayNames;
    this.format = format;
    this.formatDate = formatDate;
    this.compareDate = compareDate;
    this.toDate = toDate;

    function toDate(targetStr){
      if(targetStr.length > 10){
        var y = Number(targetStr.substr(0,4));
        var M = Number(targetStr.substr(5,2));
        var d = Number(targetStr.substr(8,2));
        var h = Number(targetStr.substr(11,2));
        var m = Number(targetStr.substr(14,2));
        var s = Number(targetStr.substr(17,2));
        return new Date(y, M-1, d, h, m, s);
      }else{
        var y = Number(targetStr.substr(0,4));
        var M = Number(targetStr.substr(5,2));
        var d = Number(targetStr.substr(8,2));
        return new Date(y, M-1, d);
      }
    }
    function compareDate(d1, d2){
      if(d1.constructor != Date || d2.constructor != Date){
        throw new Error('wrong input');
      }
      return (d1 > d2)? 1:
            (d1 == d2)? 0:
                        -1;
    }
    function getWeekCnt(year, month){
      var sdate = new Date(year, month - 1, 1);
      var edate = new Date(year, month, 0);
      var fulldate = sdate.getDay() + edate.getDate();
      return (fulldate % 7 == 0)?parseInt(fulldate / 7):(parseInt(fulldate / 7) + 1);
    }
    function format(target, format){
      var d = new Date(target);
      var res = format;

      res = res.replace(/yyyy/g, zeroPadding(String(d.getFullYear()), 4));
      res = res.replace(/MM/g, zeroPadding(String((d.getMonth() + 1)), 2));
      res = res.replace(/dd/g, zeroPadding(String(d.getDate()), 2));
      res = res.replace(/ap/g, (d.getHours() >= 12)?'pm':'am');
      res = res.replace(/AP/g, (d.getHours() >= 12)?'PM':'AM');
      res = res.replace(/HH/g, zeroPadding(String(d.getHours()), 2));
      res = res.replace(/hh/g, zeroPadding(String((d.getHours() % 12)), 2));
      res = res.replace(/mm/g, zeroPadding(String(d.getMinutes()), 2));
      res = res.replace(/ss/g, zeroPadding(String(d.getSeconds()), 2));
      return res;
    }
    function formatDate(date, format){
      var res = format;
      res = res.replace(/yyyy/g, zeroPadding(String(date.getFullYear()), 4));
      res = res.replace(/MM/g, zeroPadding(String(date.getMonth()+1), 2));
      res = res.replace(/dd/g, zeroPadding(String(date.getDate()), 2));
      res = res.replace(/ap/g, (date.getHours() >= 12)?'pm':'am');
      res = res.replace(/AP/g, (date.getHours() >= 12)?'PM':'AM');
      res = res.replace(/HH/g, zeroPadding(String(date.getHours()), 2));
      res = res.replace(/hh/g, zeroPadding(String((date.getHours() % 12)), 2));
      res = res.replace(/mm/g, zeroPadding(String(date.getMinutes()), 2));
      res = res.replace(/ss/g, zeroPadding(String(date.getSeconds()), 2));
      return res;
    }
    function zeroPadding(target_str, goal_len){
      var res = '';
      for(var i = 0;i < goal_len - target_str.length;i++){
        res += '0';
      }
      return res + target_str;
    }
    /*
    input form
      target_str,
      goal_length
    */

    function getDaysInMonth(year, month){
      return new Date(year, month, 0).getDate();
    }
    /*
    input form
      year,
      month
    */

    function dayNames(mode){
      switch(mode){
        case 'k-l':
          return ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        case 'k-s':
          return ['일', '월', '화', '수', '목', '금', '토'];
        case 'e-l':
          return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        case 'e-s':
          return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        default:
          return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
      }
    }
    /*
    input form
      mode :
        e-l;english long form,
        e-s;english short form,
        k-l;korean long form,
        k-s;korean short form
    */

  }
})();
