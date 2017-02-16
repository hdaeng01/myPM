angular.module('App')
.controller('TabCtrl', function($scope, $rootScope, $stateParams, $state, Chats, getRoomId, $http, $cordovaFile, Boards, push) {
  $rootScope.$on('cloud:push:notification', function(event, data) {
    var msg = data.message;
    var str = msg.text.split(' ');
    if(str[3]=='게시물이'){
      var pid = str[0].substring(str[0].length-9,str[0].length-1);
      getRoomId.add(pid);
      Boards.setEmpty();
      $http.get('http://192.168.1.101:8080/getBoard'+'?pid='+pid)
        .success(function(result) {
            var board = result.board;
            for (var i = 0; i < parseInt(result.boardLength); i++) {
              Boards.set(board[i].id, board[i].time, board[i].subject, board[i].content, board[i].name, board[i].hits);
            }
            $state.go('tabs.board',{chatId:pid});
        });
    }
    push.set(msg);
    var tmp = push.get();
  });

  $scope.roomId = '';
  $scope.goChat = function(){
    $scope.roomId=getRoomId.get();
    $state.go('tabs.chats',{chatId:$scope.roomId});
  }
});
