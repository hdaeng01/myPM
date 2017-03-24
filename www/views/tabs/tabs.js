angular.module('App')
.controller('TabCtrl', function($scope, $rootScope, $stateParams, $state, PresentPid, $http, $cordovaFile, Board, push, HttpServ) {
  $rootScope.$on('cloud:push:notification', function(event, data) {
    var msg = data.message;
    var str = msg.text.split(' ');
    if(str[3]=='게시물이'){
      var pid = str[0].substring(str[0].length-9,str[0].length-1);
      PresentPid.set(pid);
      Board.setEmpty();
      $http({
        method: 'POST' ,
        url: HttpServ.url+'/getBoard',
        data: {
          pid: pid
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).success(function(result) {
        var board = result;
        for (var i = 0; i < board.length; i++) {
          Board.set(board[i].id, board[i].time, board[i].subject, board[i].name, board[i].hits, board[i].comments);
        }
        $state.go('tabs.board',{pid:pid});
      });
    } else{
      var pid = str[0].substring(str[0].length-9,str[0].length-1);
      PresentPid.set(pid);
      $state.go('tabs.chats',{pid:pid});
    }
    push.set(msg);
    var tmp = push.get();
  });

  $scope.goChat = function(){
    $state.go('tabs.chats',{pid:PresentPid.get()});
  }
  $scope.goSchedule = function(){
    $state.go('tabs.schedule',{pid:PresentPid.get()});
  }
});
