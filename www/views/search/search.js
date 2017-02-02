angular.module('App')
.controller('SearchCtrl', function($scope, $stateParams, $http, $state, Chats) {
  $scope.searchRoom = function(){
    $scope.pid = this.pid;
    $http.get('http://192.168.0.4:8080/searchRoom'+'?pid='+$scope.pid).success(function(pname) {
      if (pname) {
        Chats.add(pname,$scope.pid);
        $cordovaFile.createFile(cordova.file.dataDirectory, $scope.pid+".txt", false)
            .then(function (success) {
              // success
            }, function (error) {
              // error
            });
        $state.go("main");
      } else if (pnaem=='해당정보없음') {
        alert('해당정보없음');
      }
    });
  }
})
