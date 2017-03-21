angular.module('App')
.controller('SearchCtrl', function($scope, $stateParams, $http, $state, $cordovaFile, Chats) {  //프로젝트 번호를 이용해서 프로젝트를 찾는 뷰.
  $scope.searchRoom = function(){
    $scope.pid = this.pid;  //프로젝트 번호를 가져온다.
    if (Chats.get($scope.pid)) {
      alert('기존에 존재하는 프로젝트입니다.');
    }else {
      $cordovaFile.readAsText(cordova.file.dataDirectory, "myInfo.json")
        .then(function (success) {
          // success
          var tmp = JSON.parse(success);
          var token = tmp.token;

          $http({
            method: 'POST' ,
            url: 'http://192.168.0.4:8080/searchRoom',
            data: {
              pid: $scope.pid,
              token: token,
            },
            headers: {
              'Content-Type': 'application/json'
            }
          }).success(function(project) {
            if (project.exist) {  //res.json으로 받은 결과는 JSON.parse를 한 결과로 받는다.
              Chats.add(project.pname, $scope.pid);

              var data = {
                projectName: project.pname,
                chatContents: []
              }
              $cordovaFile.writeFile(cordova.file.dataDirectory, $scope.pid+'.json', JSON.stringify(data), false)
                .then(function (success) {
                  // success

                }, function (error) {
                  // error
                });

              $cordovaFile.readAsText(cordova.file.dataDirectory, "pids.json")
                .then(function(success){
                  var p = JSON.parse(success);
                  p.pids.push({pid : $scope.pid , projectName : project.pname , boardLength : project.boardLength});
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
          })
      })
    }
  }
})
