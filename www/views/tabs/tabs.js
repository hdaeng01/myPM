angular.module('App')
.controller('TabCtrl', function($scope, $rootScope, $stateParams, $state, PresentPid, $http, $cordovaFile, Board, push, HttpServ) {
  $rootScope.$on('cloud:push:notification', function(event, data) {
    var msg = data.message;
    var str = msg.text.split(' ');
    if(str[3]=='게시물이'){ //프로젝트 이름에 빈칸은 들어갈 수 없다.!!
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
        var board = result.board;
        for (var i = 0; i < parseInt(result.boardLength); i++) {
          Board.set(board[i].id, board[i].time, board[i].subject, board[i].content, board[i].name, board[i].hits);
          console.log(board[i].id);
        }
        $scope.$watch('Board', function(newValue, oldValue){
           $state.go('tabs.board',{pid:pid});
        }, true);
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
