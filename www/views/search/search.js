angular.module('App')
<<<<<<< HEAD
.controller('SearchCtrl', function($scope, $stateParams, $http, $state, $cordovaFile, Chats) {
  $scope.searchRoom = function(){
    $scope.pid = this.pid;
    if (Chats.get($scope.pid)) {
      alert('기존에 존재하는 프로젝트입니다.');
    }else {
      $http.get('http://192.168.0.4:8080/searchRoom'+'?pid='+$scope.pid).success(function(pname) {
        if (pname) {
          Chats.add(pname,$scope.pid);
          $cordovaFile.writeFile(cordova.file.dataDirectory, $scope.pid+".txt", pname+'\n', false)
            .then(function (success) {
              // success
              $cordovaFile.writeExistingFile(cordova.file.dataDirectory, "pids", $scope.pid+'/'+pname+'/', false)
                .then(function (success) {
                  // success
                  $state.go("main");
                }, function (error) {
                  // error
                });
            }, function (error) {
              // error
            });
        } else if (pname=='해당정보없음') {
          alert('해당정보없음');
        }
      });
    }
=======
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
>>>>>>> eaaf1223fd55a821d9de92d8e6e0e5bb15b89acb
  }
})
