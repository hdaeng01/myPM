angular.module('App')
.controller('BoardCtrl', function($scope, $stateParams, Chats) {
  $scope.chatRoom = Chats.get($stateParams.chatId);
  // console.log($scope.chatRoom.id);
});
