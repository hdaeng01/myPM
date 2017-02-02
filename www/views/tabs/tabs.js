angular.module('App')
.controller('TabCtrl', function($scope, $stateParams, $state, Chats, getRoomId) {
  $scope.roomId = '';
  $scope.goChat = function(){
    $scope.roomId=getRoomId.get();
    $state.go('tabs.chats',{chatId:$scope.roomId});
  }
});
