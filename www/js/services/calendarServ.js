(function(){
  angular.module('App.services').service('calendarServ', ['storageServ', 'dateServ', calendarServ]);

  function calendarServ(storageServ, dateServ){
    const storage_name = 'calendar';
    storageServ.addStorage(storage_name, 30);

    this.getCalendar = getCalendar;
    this.getKey = makeKey;

    function makeKey(year, month){
      var date = new Date(year, month-1);
      return date.getFullYear() + '-' + (date.getMonth() + 1);
    }
    function getCalendar(year, month){
      var key = makeKey(year, month);
      if(storageServ.isExtElement(storage_name, key)){
        return angular.copy(storageServ.readElement(storage_name, key));
      }
      storageServ.putElement(storage_name, key, buildCalendar(year, month));
      return angular.copy(storageServ.readElement(storage_name, key));
    }
    function buildCalendar(year, month){
      var calendar = {};

      var sdate = new Date(year, month-1, 1);
      var ldate = new Date(year, month-1, dateServ.getDaysInMonth(year, month));
      var weekCnt = dateServ.getWeekCnt(year, month);
      calendar.config = {
        year : year,
        month : month,
        startDate : sdate,
        lastDate : ldate,
        dayCnt : 7,
        weekCnt : weekCnt,
        startDateIndex : {
          x : sdate.getDay(),
          y : 0
        },
        lastDateIndex : {
          x : ldate.getDay(),
          y : weekCnt-1
        }
      };
      calendar.isIndex = isIndex;
      calendar.getIndex = getIndex;
      calendar.getDate = getDate;
      calendar.indexState = indexState;
      calendar.weeks = [];

      var tmp = -1;
      calendar.weeks[0] = [];
      for(var i = 0;i < calendar.config.dayCnt;i++){
        if(i < calendar.config.startDateIndex.x){
          calendar.weeks[0].push({
            day : false,
            index : {
              x : i,
              y : 0
            }
          });
          continue;
        }
        if(i == calendar.config.startDateIndex.x){
          calendar.weeks[0].push({
            day : calendar.config.startDate,
            index : calendar.config.startDateIndex
          });
          tmp = 1;
          continue;
        }
        calendar.weeks[0].push({
          day : new Date(year, month-1, ++tmp),
          index : {
            x : i,
            y : 0
          }
        });
      }
      for(var i = 1;i < calendar.config.weekCnt-1;i++){
        calendar.weeks[i] = [];
        for(var j = 0;j < calendar.config.dayCnt;j++){
          calendar.weeks[i].push({
            day : new Date(year, month-1, ++tmp),
            index : {
              x : j,
              y : i
            }
          });
        }
      }
      calendar.weeks[calendar.config.weekCnt-1] = [];
      for(var i = 0;i < calendar.config.dayCnt;i++){
        if(i < calendar.config.lastDateIndex.x){
          calendar.weeks[calendar.config.weekCnt-1].push({
            day : new Date(year, month-1, ++tmp),
            index : {
              x : i,
              y : calendar.config.weekCnt-1
            }
          });
          continue;
        }
        if(i == calendar.config.lastDateIndex.x){
          calendar.weeks[calendar.config.weekCnt-1].push({
            day : calendar.config.lastDate,
            index : calendar.config.lastDateIndex
          });
          continue;
        }
        calendar.weeks[calendar.config.weekCnt-1].push({
          day : false,
          index : {
            x : i,
            y : calendar.config.weekCnt-1
          }
        });
      }

      return calendar;
    }
    function getIndex(date){
      if(date.constructor != Date){
        throw new Error('wrong input at getIndex\n\tinput : ' + date);
      }
      if(date.getFullYear() != this.config.year){
        return false;
      }
      if(date.getMonth()+1 != this.config.month){
        return false;
      }
      var t = date.getDate() - this.config.startDate.getDate();
      t += this.config.startDateIndex.x;
      return {
        x : t % this.config.dayCnt,
        y : parseInt(t / this.config.dayCnt)
      };
    }
    function getDate(index){
      if(!index){
        throw new Error('wrong input at getDate\n\tinput : ' + index);
      }
      if(index.constructor == Date){
        var t = getIndex(index);
        return getDate(t);
      }
      if(isIndex(index)){
        if(index.y < 0 || index.y >= this.config.weekCnt){
          return false;
        }
        if(index.x < 0 || index.x >= this.config.dayCnt){
          return false;
        }
        return this.weeks[index.y][index.x];
      }
      throw new Error('wrong input at getDate\n\tinput : ' + index);
    }
    function isIndex(i){
      if(!i){
        return false;
      }
      if(!angular.isNumber(i.x) || !angular.isNumber(i.y)){
        return false;
      }
      return true;
    }
    function indexState(i){
      if(!isIndex(i)){
        throw new Error('wrong index');
      }
      var t = i.x + i.y * this.config.dayCnt;
      var st = this.config.startDateIndex.x + this.config.startDateIndex.y * this.config.dayCnt;
      var lt = this.config.lastDateIndex.x + this.config.lastDateIndex.y * this.config.dayCnt;
      return (t >= st)?((t <= lt)?0:1):-1;
    }
  }
})();
