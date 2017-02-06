angular.module('App')
.controller('SearchCtrl', function($scope, $stateParams, $http, $state, $cordovaFile, Chats) {
  $scope.searchRoom = function(){
    $scope.pid = this.pid;
    if (Chats.get($scope.pid)) {
      alert('기존에 존재하는 프로젝트입니다.');
    }else {
      $http.get('http://192.168.1.101:8080/searchRoom'+'?pid='+$scope.pid).success(function(project) {
        if (project.exist) {
          Chats.add(project.pname,$scope.pid);
          $cordovaFile.readAsText(cordova.file.dataDirectory, "pids.json")
            .then(function(success){
              var p = JSON.parse(success);
              p.pids.push({pid : $scope.pid , projectName : project.pname});
              $cordovaFile.writeFile(cordova.file.dataDirectory, "pids.json", JSON.stringify(p), true)
                .then(function (success) {
                  // success

                  $state.go("main");
                }, function (error) {
                  // error
                });
            }, function(error){

            });
        } else{
          alert('해당정보없음');
        }
      });
    }
  }
})
