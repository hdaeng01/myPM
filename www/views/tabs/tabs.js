angular.module('App')
.controller('TabCtrl', function($scope, $rootScope, $stateParams, $state, PresentPid, $http, $cordovaFile, Board, push, HttpServ, Projects) {
  $scope.goChat = function(){
    $state.go('tabs.chats',{pid:PresentPid.get()});
  }
  $scope.goSchedule = function(){
    $state.go('tabs.schedule',{pid:PresentPid.get()});
  }
});
