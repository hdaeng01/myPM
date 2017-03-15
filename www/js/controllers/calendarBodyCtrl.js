(function(){
  angular.module('App.controllers').controller('calendarBodyCtrl', ['$scope', 'dateServ', '$ionicPosition', '$ionicModal', '$rootScope', 'clientConfig', '$ionicPopup', 'scheServ', 'mathServ', 'calendarServ', 'serverServ', 'authServ', calendarBodyCtrl]);

  function calendarBodyCtrl($scope, dateServ, $ionicPosition, $ionicModal, $rootScope, clientConfig, $ionicPopup, scheServ, mathServ, calendarServ, serverServ, authServ){
    $scope.scopes = {
      eventAddModalScope : $rootScope.$new(),
      eventReadModalScope : $rootScope.$new()
    };
    $scope.data = {};
    $scope.config = {};
    $scope.modals = {};
    $scope.functions = {//public functions
      onDrag : function(e){
        switch($scope.mode){
          case 'read':
          break;
          default://write
          {
            var calendar = $scope.data.calendar;
            var config = $scope.config;
            var select = $scope.data.select;
            if(!select.from){
              return;
            }
            var gesX = e.gesture.center.pageX - $scope.config.body.left;
            var gesY = e.gesture.center.pageY - $scope.config.body.top;
            if(gesY < 0 || gesY >= config.body.height){
              return;
            }
            if(gesX < 0|| gesX >= config.body.width){
              return;
            }
            var curIndex = {
              x : parseInt(gesX / (config.body.width / calendar.config.dayCnt)),
              y : parseInt(gesY / (config.body.height / calendar.config.weekCnt))
            };
            if(!calendar.isIndex(curIndex)){
              return;
            }
            var curIndexState = calendar.indexState(curIndex);
            if(curIndexState < 0){
              select.to = calendar.config.startDateIndex;
              changeSelect(select.to, select.from);
              return;
            }
            if(curIndexState > 0){
              select.to = calendar.config.lastDateIndex;
              changeSelect(select.from, select.to);
              return;
            }
            select.to = curIndex;
            var minIndex, maxIndex;
            if(compareIndex(select.to, select.from) > 0){
              maxIndex = select.to;
              minIndex = select.from;
            }else{
              maxIndex = select.from;
              minIndex = select.to;
            }
            changeSelect(minIndex, maxIndex);
          }
          break;
        }
      },
      onTouch : function(e){
        switch($scope.mode){
          case 'read':
          {
            var calendar = $scope.data.calendar;
            var i = findIndex(angular.element(e.srcElement), 'index', 10);
            if(!i){
              return;
            }
            i = JSON.parse(i);

            if(calendar.indexState(i) != 0){
              return;
            }
            var eventReadModalScope = $scope.scopes.eventReadModalScope;
            var target = calendar.weeks[i.y][i.x].day;
            scheServ.readDaily(serverServ.fullpath, target, authServ.id).then(function(res){
              eventReadModalScope.functions.show(target, res);
            });
          }
          break;
          default://write
          {
            var calendar = $scope.data.calendar;
            var select = $scope.data.select;
            var i = findIndex(angular.element(e.srcElement), 'index', 10);
            if(!i){
              return;
            }
            i = JSON.parse(i);
            if(!calendar.isIndex(i) || calendar.indexState(i) != 0){
              return;
            }
            select.from = select.to = i;
            changeSelect(i, i);
          }
          break;
        }
      },
      onRelease : function(e){
        switch($scope.mode){
          case 'read':
          break;
          default://write
          {
            var calendar = $scope.data.calendar;
            var select = $scope.data.select;
            var eventAddModalScope = $scope.scopes.eventAddModalScope;
            if(!calendar.isIndex(select.from) || !calendar.isIndex(select.to)){
              return;
            }

            eventAddModalScope.$broadcast('setColorList', {colorList : eventAddModalScope.config.colorList});
            if(compareIndex(select.from, select.to) < 0){
                eventAddModalScope.functions.show({
                  min : calendar.weeks[select.from.y][select.from.x].day,
                  max : calendar.weeks[select.to.y][select.to.x].day
                });
            }else{
                eventAddModalScope.functions.show({
                  min : calendar.weeks[select.to.y][select.to.x].day,
                  max : calendar.weeks[select.from.y][select.from.x].day
                });
            }
          }
          break;
        }
      },
      initialize : function(){
        $scope.data.select = {
          from : false,
          to : false
        };
      }
    };

    $scope.functions.initialize();

    //private functions
    function compareIndex(i1, i2){
      var calendar = $scope.data.calendar;
      var i1_res = calendar.isIndex(i1);
      var i2_res = calendar.isIndex(i2);
      if(!i1_res && !i2_res){
        throw new Error('invalid input');
      }
      i1_res = i1.x + i1.y * calendar.config.dayCnt;
      i2_res = i2.x + i2.y * calendar.config.dayCnt;
      return (i1_res > i2_res)?1:(i1_res == i2_res)?0:-1;
    }
    function setCalendar(y, m){
      $scope.data.calendar = calendarServ.getCalendar(y, m);
      $scope.config = {
        weekHeight : (100 / $scope.data.calendar.config.weekCnt),
        body : $ionicPosition.offset(angular.element(document.querySelector('div#calendar-body')))
      };

      scheServ.readTerm(serverServ.fullpath, {
        startDate : $scope.data.calendar.config.startDate,
        endDate : $scope.data.calendar.config.lastDate
      }, authServ.id).then(function(res){
        angular.forEach(res, function(value, key){
          addEvent(value);
        });
      }).catch(function(err){
        alert('failed in reading schedules');
      });
    }
    function turnOffSelect(){
      var calendar = $scope.data.calendar;
      angular.forEach(calendar.weeks, function(week, index){
        angular.forEach(week, function(day, index){
          if(day.day){
            day.selected = false;
          }
        });
      });
    }
    function changeSelect(minIndex, maxIndex){
      var calendar = $scope.data.calendar;
      for(var i = 0;i < calendar.config.weekCnt;i++){
        for(var j = 0;j < calendar.config.dayCnt;j++){
          var targetIndex = {
            x : j,
            y : i
          };
          if(compareIndex(targetIndex, minIndex) >= 0 && compareIndex(targetIndex, maxIndex) <= 0){
            calendar.weeks[i][j].selected = true;
          }else{
            calendar.weeks[i][j].selected = false;
          }
        }
      }
    }
    function findIndex(elem, attrname, maxDepth){
      if(maxDepth <= 0){
        return undefined;
      }
      if(elem.attr(attrname)){
        return elem.attr(attrname);
      }
      return findIndex(elem.parent(), attrname, maxDepth-1);
    }
    function addEvent(eventInfo){
      var calendar = $scope.data.calendar;
      var event_start_index = calendar.getIndex(eventInfo.startDate);
      var event_end_index = calendar.getIndex(eventInfo.endDate);

      if(!event_start_index){
        event_start_index = calendar.config.startDateIndex;
      }
      if(!event_end_index){
        event_end_index = calendar.config.lastDateIndex;
      }

      var dim1sindex = event_start_index.x + event_start_index.y * calendar.config.dayCnt;
      var dim1lindex = event_end_index.x + event_end_index.y * calendar.config.dayCnt;

      var date_events_state = [0, 0, 0];
      var date_events_index = 0;
      for(var i = dim1sindex;i <= dim1lindex;i++){
        var date = calendar.getDate({
          x : i % calendar.config.dayCnt,
          y : parseInt(i / calendar.config.dayCnt)
        });
        if(!date.eventInfo){
          date.eventInfo = {
            events : [false, false, false],
            more : 0
          };
        }
        for(var j = 0;j < date_events_state.length;j++){
          if(!date.eventInfo.events[j]){
            date_events_state[j]++;
            if(date_events_state[date_events_index] < date_events_state[j]){
              date_events_index = j;
            }
          }
        }
      }
      var flag = true;
      for(var i = dim1sindex;i <= dim1lindex;i++){
        var date = calendar.getDate({
          x : i % calendar.config.dayCnt,
          y : parseInt(i / calendar.config.dayCnt)
        });
        if(!date.eventInfo.events[date_events_index]){
          date.eventInfo.events[date_events_index] = eventInfo;
          if(flag){
            date.eventInfo.events[date_events_index].viewInfo = {
              show_start_date : date.day
            };
            flag = false;
          }
        }else{
          date.eventInfo.more++;
        }
      }
    }
    /*
    eventInfo{
      startDate : d1 not null Date, startDate always smaller then endDate
      endDate : d2 not null Date, startDate always smaller then endDate
      title : d3 not null,
      eventId : d4 not null,
      color : d5 not null
      description : d6 not null
    }
    */

    ionic.Platform.ready(function(){
      var eventAddModalScope = $scope.scopes.eventAddModalScope;
      var eventReadModalScope = $scope.scopes.eventReadModalScope;


      eventAddModalScope.config = {
        dateForm : clientConfig.dateForm1,
        colorList : scheServ.colorList
      };
      eventAddModalScope.scopes = {
        datePickerScope : $rootScope.$new()
      };
      eventAddModalScope.data = {};
      eventAddModalScope.functions = {
        show : function(form){
          var eventAddModal = $scope.modals.eventAddModal;
          eventAddModalScope.data.date = {
            min : form.min,
            max : form.max
          };
          eventAddModalScope.data.color = eventAddModalScope.config.colorList[0];
          eventAddModalScope.data.title = '';
          eventAddModalScope.data.description = '';
          eventAddModalScope.$broadcast('setSelectedIndex', {index : 0});
          eventAddModal.show();
        },/*
        input form
        {
          min : d1,
          max : d2
        }
        */
        hide : function(){
          var eventAddModal = $scope.modals.eventAddModal;
          if(!eventAddModal){
            return;
          }
          turnOffSelect();
          eventAddModal.hide();
        },
        format : dateServ.formatDate,
        showDatePicker : function(form){
          var scope = eventAddModalScope.scopes.datePickerScope;
          scope.data.target = form.target;
          $ionicPopup.show({
            templateUrl : 'views/schedule/datePicker.html',
            scope : eventAddModalScope.scopes.datePickerScope,
            buttons : [{
              text : 'Select',
              title : form.title || 'Select Date',
              type : 'button-positive',
              onTap : function(e){
                if(!scope.data.target){
                  return;
                }
                switch(form.flag){
                  case 0:
                  {
                    if(dateServ.compareDate(scope.data.target, eventAddModalScope.data.date.max) > 0){
                      eventAddModalScope.data.date.min = eventAddModalScope.data.date.max;
                      eventAddModalScope.data.date.max = scope.data.target;
                    }else{
                      eventAddModalScope.data.date.min = scope.data.target;
                    }
                  }
                  break;
                  case 1:
                  {
                    if(dateServ.compareDate(scope.data.target, eventAddModalScope.data.date.min) < 0){
                      eventAddModalScope.data.date.max = eventAddModalScope.data.date.min;
                      eventAddModalScope.data.date.min = scope.data.target;
                    }else{
                      eventAddModalScope.data.date.max = scope.data.target;
                    }
                  }
                  break;
                  default:
                  break;
                }
              }
            }, {
              text : 'Cancel'
            }]
          });
        },
        /*
        input form
        {
          title : d1,
          target : d2 not null,
          flag : d3
        }
        */
        createSchedule : function(){
          var scope = eventAddModalScope;
          scheServ.create(serverServ.fullpath, {
            startDate : scope.data.date.min,
            endDate : scope.data.date.max,
            title : scope.data.title,
            description : scope.data.description,
            repeat_period : 1,
            color : scope.data.color,
          }, authServ.id).then(function(succ){
            var calendar = $scope.data.calendar;
            setCalendar(calendar.config.year, calendar.config.month);
            eventAddModalScope.functions.hide();
          }).catch(function(err){
            alert('add schedule failed');
          });
        }
      };
      eventAddModalScope.scopes.datePickerScope.data = {};
      eventAddModalScope.$on('updateSelected', function(event, args){
        eventAddModalScope.data.color = args.selected;
      });

      eventReadModalScope.data = {};
      eventReadModalScope.modals = {};
      eventReadModalScope.scopes = {
        eventDetailScope : $rootScope.$new()
      };
      eventReadModalScope.functions = {
        show : function(targetDate, events){
          var scope = eventReadModalScope;
          var eventReadModal = $scope.modals.eventReadModal;
          scope.data.events = events;
          scope.data.date = targetDate;
          scope.dirtied = false;
          eventReadModal.show();
        },
        detail : function(eventId){
          scheServ.readEvent(serverServ.fullpath, eventId, authServ.id).then(function(succ){
            var detscope = eventReadModalScope.scopes.eventDetailScope;
            detscope.data.event = succ;
            detscope.$broadcast('setSelectedIndex', {index : scheServ.findColorIndex(succ.color)});
            detscope.functions.show(eventId);
          });
        },
        delete : function(eventId){
          scheServ.delete(serverServ.fullpath, eventId, authServ.id).then(function(succ){
            return scheServ.readDaily(serverServ.fullpath, eventReadModalScope.data.date, authServ.id);
          }).then(function(succ){
            eventReadModalScope.data.events = succ;
            eventReadModalScope.data.dirtied = true;
          }).catch(function(err){
            alert('delete schedule failed');
          });
        },
        hide : function(){
          var calendar = $scope.data.calendar;
          var eventReadModal = $scope.modals.eventReadModal;
          if(eventReadModalScope.data.dirtied){
            setCalendar(calendar.config.year, calendar.config.month);
          }
          eventReadModal.hide();
        },
        format : dateServ.formatDate
      };
      eventReadModalScope.config = {
        dateForm : clientConfig.dateForm1
      };

      var eventDetailScope = eventReadModalScope.scopes.eventDetailScope;
      eventDetailScope.data = {};
      eventDetailScope.scopes = {
        datePickerScope : $rootScope.$new()
      };
      eventDetailScope.config = {
        colorList : scheServ.colorList,
        dateForm : clientConfig.dateForm1
      };
      eventDetailScope.functions = {
        show : function(sid){
          var scope = eventDetailScope;
          var detmodal = eventReadModalScope.modals.eventDetailModal;
          scheServ.readEvent(serverServ.fullpath, sid, authServ.id).then(function(succ){
            scope.data.event = succ;
            detmodal.show();
          }).catch(function(err){
            alert('failed in reading event');
          });
        },
        showDatePicker : function(form){
          var scope = eventDetailScope.scopes.datePickerScope;
          scope.data.target = form.target;
          $ionicPopup.show({
            templateUrl : 'views/schedule/datePicker.html',
            scope : eventDetailScope.scopes.datePickerScope,
            buttons : [{
              text : 'Select',
              title : form.title || 'Select Date',
              type : 'button-positive',
              onTap : function(e){
                if(!scope.data.target){
                  return;
                }
                switch(form.flag){
                  case 0:
                  {
                    if(dateServ.compareDate(scope.data.target, eventDetailScope.data.event.endDate) > 0){
                      eventDetailScope.data.event.startDate = eventDetailScope.data.event.endDate;
                      eventDetailScope.data.event.endDate = scope.data.target;
                    }else{
                      eventDetailScope.data.event.startDate = scope.data.target;
                    }
                  }
                  break;
                  case 1:
                  {
                    if(dateServ.compareDate(scope.data.target, eventDetailScope.data.event.startDate) < 0){
                      eventDetailScope.data.event.endDate = eventDetailScope.data.event.startDate;
                      eventDetailScope.data.event.startDate = scope.data.target;
                    }else{
                      eventDetailScope.data.event.endDate = scope.data.target;
                    }
                  }
                  break;
                  default:
                  break;
                }
              }
            }, {
              text : 'Cancel'
            }]
          });
        },
        hide : function(){
          if(!eventReadModalScope.modals.eventDetailModal){
            return;
          }
          eventReadModalScope.modals.eventDetailModal.hide();
        },
        format : dateServ.formatDate,
        update : function(eventId){
          var scope = eventDetailScope;
          var event = scope.data.event;
          scheServ.update(serverServ.fullpath, {
            sid : eventId,
            updateData : {
              startDate : dateServ.format(event.startDate, clientConfig.dateForm1),
              endDate : dateServ.format(event.endDate, clientConfig.dateForm1),
              title : event.title,
              description : event.description,
              color : event.color
            }
          }, authServ.id).catch(function(err){
            alert('failed in updating event');
          }).then(function(succ){
            return scheServ.readDaily(serverServ.fullpath, eventReadModalScope.data.date, authServ.id);
          }).then(function(succ){
            eventReadModalScope.data.dirtied = true;
            eventReadModalScope.data.events = succ;
            eventDetailScope.functions.hide();
          }).catch(function(err){
          });
        }
      };
      eventDetailScope.scopes.datePickerScope.data = {};


      $ionicModal.fromTemplateUrl('views/schedule/eventAddModal.html', {
        animation : 'slide-in-up',
        scope : eventAddModalScope
      }).then(function(modal){
        $scope.modals.eventAddModal = modal;
      });
      $ionicModal.fromTemplateUrl('views/schedule/eventReadModal.html', {
        animation : 'slide-in-right',
        scope : eventReadModalScope,
        focusFirstInput : true
      }).then(function(modal){
        $scope.modals.eventReadModal = modal;
      });
      $ionicModal.fromTemplateUrl('views/schedule/eventDetailModal.html', {
        animation : 'slide-in-right',
        scope : eventReadModalScope.scopes.eventDetailScope,
        focusFirstInput : true
      }).then(function(modal){
        eventReadModalScope.modals.eventDetailModal = modal;
      });

    });

    $scope.$on('update-date', function(event, args){
      setCalendar(args.year, args.month);
    });
    $scope.$on('mode-change', function(event, args){
      $scope.mode = args.mode;
      switch(args.mode){
        case 'read':
          {
            turnOffSelect();
          }
        break;
        default://write
        break;
      }
    });
    $scope.$on('$destroy', function(){
      if($scope.modals.eventAddModal){
        $scope.modals.eventAddModal.remove();
      }
      if($scope.modals.eventReadModal){
        $scope.modals.eventReadModal.remove();
      }
    });
  }
})();
