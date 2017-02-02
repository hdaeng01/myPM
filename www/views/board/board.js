angular.module('App')
.controller('BoardCtrl', function($scope, $stateParams, Chats, Boards, $ionicNavBarDelegate, getRoomId) {
  $scope.chatRoom = Chats.get($stateParams.chatId);
  $scope.board = Boards.get($stateParams.boardId);
  $scope.boards = Boards.all();
  getRoomId.add($stateParams.chatId);
})

.controller('BoardDetailCtrl', function($scope, $stateParams, $ionicNavBarDelegate, Boards) {
  $ionicNavBarDelegate.showBackButton(true);
  $scope.board = Boards.get($stateParams.boardId);
  $scope.comments = $scope.board.comments;

  $scope.add = function(){
    $scope.comment = this.comment;
    $scope.board.comments.push({name:'익명',content:$scope.comment});
    this.comment = ' ';
  }
});
