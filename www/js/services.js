angular.module('App.factories',[])

.factory('Projects', function() {
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

.factory('MySocket', function (socketFactory, HttpServ) {
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
  var board = [];

  return {
    all: function() {
      return board;
    },
    remove: function(chat) {
      board.splice(board.indexOf(chat), 1);
    },
    get: function(boardId) {
      for (var i = 0; i < board.length; i++) {
        if (board[i].id == parseInt(boardId)) {
          return board[i];
        }
      }
      return null;
    },
    getLength: function(){
      return board.length;
    },
    getLastId: function(){
      return board[board.length-1].id;
    },
    set: function(_id, _time, _title, _name, _hits, _comments){
      board.push({id:_id, name:_name, title:_title, time:_time, hits:_hits, comments:_comments});
    },
    unshift: function(_id, _time, _title, _name, _hits, _comments){
      board.unshift({id:_id, name:_name, title:_title, time:_time, hits:_hits, comments:_comments});
    },
    setEmpty: function(){
      board = [];
      console.log('게시판 지움');
    },
    removeBoard: function(boardId) {
      for (var i = 0; i < board.length; i++) {
        if (board[i].id == parseInt(boardId)) {
          board.splice(board.indexOf(board[i]), 1);
          break;
        }
      }
    },
    setHits: function(id){
      for (var i = 0; i < board.length; i++) {
        if (board[i].id == id) {
          var tmp = parseInt(board[i].hits);
          tmp = (++tmp).toString();
          board[i].hits = tmp;
          break;
        }
      }
    }
  };
})

.factory('MyInfo', function() {
  var name;
  var id;

  return {
    setName: function(_name){
      name=_name;
    },
    setId: function(_id){
      id=_id;
    }
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
  }
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
    }
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
