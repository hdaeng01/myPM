angular.module('App')
.controller('SearchCtrl', function($scope, $stateParams, $http, $state, Chats) {
  $scope.searchRoom = function(){
    $scope.pid = this.pid;
    $http.get('/searchRoom'+'?pid='+$scope.pid).success(function(pname) {
      if (pname) {
        Chats.add(pname,$scope.pid);
        $state.go("main");
      } else if (pnaem=='해당정보없음') {
        alert('해당정보없음');
      }
    });
  }
})
