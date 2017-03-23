angular.module('App.factories',[])

.factory('Projects', function() {  //프로젝트들을 채팅방개념으로 인식.
  var projects = [];
  return {
    all: function() {
      return projects;
    },
    remove: function(project) {
      projects.splice(projects.indexOf(project), 1);
    },
    get: function(pid) {
      for (var i = 0; i < projects.length; i++) {
        if (projects[i].pid === pid) {
          return projects[i];
        }
      }
      return null;
    },
    add: function(_pid,_pname){
      projects.push({pid:_pid, pname:_pname, img:'img/'+_pname+'.png'});
    }
  };
})

.factory('HttpServ', function(){
  return {
    url : 'http://192.168.0.4:8080'
  }
})

.factory('mySocket', function (socketFactory, HttpServ) {
  var myIoSocket = io.connect(HttpServ.url);

  mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
})

.factory('PresentPid', function() {
  var pid;

  return {
      set : function(_pid){
        pid = _pid;
      },
      get : function(){
        return pid;
      }
  };
})

.factory('Board', function() {
  var boards = [];

  return {
    all: function() {
      return boards;
    },
    remove: function(chat) {
      boards.splice(boards.indexOf(chat), 1);
    },
    get: function(boardId) {
      for (var i = 0; i < boards.length; i++) {
        if (boards[i].id == parseInt(boardId)) {
          return boards[i];
        }
      }
      return null;
    },
    getLength: function(){
      return boards.length;
    },
    set: function(_id, _time, _title, _content, _name, _hits, _comments){
      boards.push({id:_id, name:_name, title:_title, content:_content, time:_time, hits:_hits, comments:_comments});
    },
    unshift: function(_id, _time, _title, _content, _name, _hits, _comments){
      boards.unshift({id:_id, name:_name, title:_title, content:_content, time:_time, hits:_hits, comments:_comments});
    },
    setEmpty: function(){
      boards = [];
      console.log('게시판 지움');
    },
    removeBoard: function(boardId) {
      for (var i = 0; i < boards.length; i++) {
        if (boards[i].id == parseInt(boardId)) {
          boards.splice(boards.indexOf(boards[i]), 1);
          break;
        }
      }
    },
    setHits: function(id){
      for (var i = 0; i < boards.length; i++) {
        if (boards[i].id == id) {
          var tmp = parseInt(boards[i].hits);
          tmp = (++tmp).toString();
          boards[i].hits = tmp;
          break;
        }
      }
    },
    change: function(id){
      for (var i = boards.length-1; i > -1; i--) {
        if (boards[i].id==id) {
            var tmp = parseInt(boards[i].id)-1;
            boards[i].id = tmp;
            id++;
        }
      }
    }
  };
})

.factory('MyInfo', function() {
  var name;
  var id;

  return {
    addName: function(_name){
      name=_name;
    },
    addId: function(_id){
      id=_id;
    },
    getMyName: function(){
      return name;
    },
    getMyId: function(){
      return id;
    }
  }
})

.factory('checkLogin', function(){
  var login=false;
  return {
    set: function(){
      login=true;
    },
    get: function(){
      return login;
    }
  }
})

.factory('push', function(){
  var push;

  return{
    set: function(p){
      push = p;
    },
    get: function(){
      return push;
    }
  }
})

.factory ('StorageService', function ($localStorage) {
  $localStorage = $localStorage.$default({
    things: []
  });
  var _get = function () {
    return $localStorage.things[0];
  };
  var _add = function (thing) {
    $localStorage.things.push(thing);
  }
  var _remove = function (thing) {
    $localStorage.things.splice($localStorage.things.indexOf(thing), 1);
  }
  return {
      get: _get,
      add: _add,
      remove: _remove
    };
})

.directive('focusMe',['$timeout',function ($timeout) {
  return {
    link: function (scope, element, attrs) {
      if (attrs.focusMeDisable === "true") {
        return;
      }
      $timeout(function () {
        element.on('blur', function() {
          if (attrs.focusMeDisable === "false") {
              element[0].focus();
          }
        });
      }, 350);
    }
  };
}])

.directive('fileModel', ['$parse', function ($parse){
    return {
      scope : false,
      restrict : 'A',
      link : function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                  modelSetter(scope, element[0].files[0]);
                });
              });
            }
          };
}])

.directive('projectDirec', function (){
  return {
    scope : false,
    restrict : 'E',
    controller : ['$scope', 'projectServ', function($scope, projectServ){
      $scope.gotoInfo = function(){
        $state.go('info');
      };
    }],
    template : '<a ng-click="gotoInfo();"><span class="ion-ios-information-outline"></span></a>'
  };
});
