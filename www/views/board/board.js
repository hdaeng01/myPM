angular.module('App')
.controller('BoardCtrl', function($scope, $stateParams, Chats, Boards) {
  $scope.chatRoom = Chats.get($stateParams.chatId);
  $scope.board = Boards.get($stateParams.boardId);
  $scope.boards = Boards.all();

});
