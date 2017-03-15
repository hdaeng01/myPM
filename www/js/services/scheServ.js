(function(){
  angular.module('App.services').service('scheServ', ['$http', '$q', 'dateServ', 'clientConfig', 'storageServ', scheServ]);

  function scheServ($http, $q, dateServ, clientConfig, storageServ){
    const storage_name = 'event';

    this.init = init;
    this.destroy = destroy;
    this.readTerm = readTerm;
    this.readDaily = readDaily;
    this.readEvent = readEvent;
    this.create = create;
    this.update = update;
    this.delete = del;
    this.colorList = ['#ff3333', '#ffa64d', '#ffff4d', '#5cd65c', '#66a3ff', '#3366ff', '#a366ff'];
    this.findColorIndex = findColorIndex;

    //when merge project move this code to login section
    init();
    //when merge project move this code to unlogin section
    //destroy();

    function findColorIndex(color){
      var index = 0;
      for(var i in this.colorList){
        if(this.colorList[i] == color){
          index = i;
        }
      }
      return index;
    }
    function makeKeys(startDate, endDate){
      var sy = startDate.getFullYear();
      var sm = startDate.getMonth();
      var endPoint = endDate.getFullYear() * 100 + (endDate.getMonth() + 1);
      var res = [];

      for(;sy * 100 + (sm + 1) <= endPoint;){
        res.push(makeKey(new Date(sy, sm, 1)));
        sm += 1;
        sm %= 12;
      }
      return res;
    }
    function makeKey(){
      if(arguments.length == 1 && arguments[0].constructor === Date){
        var y = arguments[0].getFullYear();
        var m = arguments[0].getMonth();
        var ld = dateServ.getDaysInMonth(y, m+1);
        var fromD = new Date(y, m, 1);
        var toD = new Date(y, m, ld);
        return dateServ.formatDate(fromD, clientConfig.dateForm1) + '~' + dateServ.formatDate(toD, clientConfig.dateForm1);
      }else if(arguments.length == 2 && arguments[0].constructor === Date && arguments[0].constructor === Date){
        return dateServ.formatDate(arguments[0], clientConfig.dateForm1) + '~' + dateServ.formatDate(arguments[1], clientConfig.dateForm1);
      }else{
        return false;
      }
    }
    function readTerm(url, form, uid){
      return $q(function(resolve, reject){
        if(!form || !url || !uid){
          return reject(400);
        }
        if(!form.startDate || !form.endDate){
          return reject(400);
        }
        if(form.startDate.constructor !== Date || form.endDate.constructor !== Date){
          return reject(400);
        }
        var key = makeKey(form.startDate, form.endDate);

        if(storageServ.isExtElement(storage_name, key)){
          var data = storageServ.readElement(storage_name, key);
          return resolve(data);
        }
        $http({
          url : url + '/users/' + uid + '/schedules',
          method : 'GET',
          params : {
            startDate : form.startDate,
            endDate : form.endDate
          }
        }).then(function(succ){
          var data = succ.data;
          data.map(function(val){
            val.startDate = dateServ.toDate(val.startDate);
            val.endDate = dateServ.toDate(val.endDate);
            return val;
          });
          storageServ.putElement(storage_name, key, data);
          return resolve(data);
        }).catch(function(err){
          return reject(err.status);
        });
      });
    }
    /*
    input form
    url,
    {
      startDate : d1 not null Date,
      endDate : d2 not null Date
    },
    uid
    */

    function readDaily(url, day, uid){
      return $q(function(resolve, reject){
        if(!url || !day || !uid){
          return reject(400);
        }
        var key = makeKey(day);
        if(!key){
          return reject(400);
        }
        if(storageServ.isExtElement(storage_name, key)){
          var data = storageServ.readElement(storage_name, key);
          return resolve(filterDaily(data, day));
        }

        var y = day.getFullYear();
        var m = day.getMonth();
        readTerm(url, {
          startDate : new Date(y, m, 1),
          endDate : new Date(y, m, dateServ.getDaysInMonth(y, m+1))
        }, uid).then(function(succ){
          return resolve(filterDaily(succ, day));
        }).catch(function(err){
          return reject(err.status);
        });
      });
    }
    function filterDaily(days, day){
      var res = [];
      angular.forEach(days, function(val, index){
        if(val.startDate <= day && day <= val.endDate){
          res.push(val);
        }
      });
      return res;
    }
    function readEvent(url, sid, uid){
      return $q(function(resolve, reject){
        if(!url || !sid || !uid){
          return reject(400);
        }
        var event = findEvent(sid);
        if(event){
          return resolve(event);
        }
        $http({
          url : url + '/users/' + uid + '/schedules/' + sid,
          method : 'GET'
        }).then(function(succ){
          var data = succ.data;
          data.startDate = dateServ.toDate(data.startDate);
          data.endDate = dateServ.toDate(data.endDate);
          return resolve(data);
        }).catch(function(err){
          return reject(err.status);
        });
      });
    }
    function findEvent(sid){
      var elemKeys = storageServ.readElementKeys(storage_name);
      for(var i = 0;i < elemKeys.length;i++){
        var elem = storageServ.readElement(storage_name, elemKeys[i]);
        for(var j = 0;j < elem.length;j++){
          if(elem[j].sid === sid){
            return elem[j];
          }
        }
      }
      return undefined;
    }
    function create(url, form, uid){
      return $q(function(resolve, reject){
        if(!url || !form || !uid){
          return reject(400);
        }
        if(!form.startDate || !form.endDate || !form.title || !form.description || !form.color){
          return reject(400);
        }
        $http({
          url : url + '/users/' + uid + '/schedules',
          method : 'POST',
          data : {
            startDate : dateServ.formatDate(form.startDate, clientConfig.dateForm1),
            endDate : dateServ.formatDate(form.endDate, clientConfig.dateForm1),
            title : form.title,
            description : form.description,
            color : form.color
          }
        }).then(function(succ){
          var keys = makeKeys(form.startDate, form.endDate);
          angular.forEach(keys, function(value, index){
            storageServ.deleteElement(storage_name, value);
          });
          return resolve(succ.status);
        }).catch(function(err){
          return reject(err.status);
        });
      });
    }
    /*
    input form
    url, {
      startDate : d1,
      endDate : d2,
      title : d3,
      description : d4,
      color : d5
    }, uid
    */

    function update(url, form, uid){
      return $q(function(resolve, reject){
        if(!url || !form || !uid){
          return reject(400);
        }
        if(!form.sid || !form.updateData){
          return reject(400)
        }

        $http({
          url : url + '/users/' + uid + '/schedules/' + form.sid,
          method : 'POST',
          data : {
            _method : 'PUT',
            updateData : form.updateData
          }
        }).then(function(succ){
          var event = findEvent(form.sid);
          if(!event){
            var keys = makeKeys(event.startDate, event.endDate);
            angular.forEach(keys, function(value, index){
              storageServ.deleteElement(storage_name, value);
            });
          }
          return resolve(succ.status);
        }).catch(function(err){
          return reject(err.status);
        });
      });
    }
    /*
    input form
    url, {
      sid,
      updateData : {*update data*}
    }, uid
    */

    function del(url, sid, uid){
      return $q(function(resolve, reject){
        if(!url || !sid || !uid){
          return reject(400);
        }
        $http({
          url : url + '/users/' + uid + '/schedules/' + sid,
          method : 'POST',
          data : {
            _method : 'DELETE'
          }
        }).then(function(succ){
          var event = findEvent(sid);
          if(event){
            var elemKeys = makeKeys(event.startDate, event.endDate);
            for(var i = 0;i < elemKeys.length;i++){
              storageServ.deleteElement(storage_name, elemKeys[i]);
            }
          }
          return resolve(succ.status);
        }).catch(function(err){
          return reject(err.status);
        });
      });
    }
    /*
    input form
    url, sid ,uid
    */

    function init(){
      storageServ.addStorage(storage_name);
    }
    function destroy(){
      storageServ.deleteStorage(storage_name);
    }
  }
})();
