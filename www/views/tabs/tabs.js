angular.module('App')
.controller('TabCtrl', function($scope, $stateParams, Chats, getRoomId) {
  $scope.chatId = getRoomId.get();
});
