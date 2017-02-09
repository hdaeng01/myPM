angular.module('App')
.controller('SearchCtrl', function($scope, $stateParams, $http, $state, $cordovaFile, Chats) {
  $scope.searchRoom = function(){
    $scope.pid = this.pid;
    if (Chats.get($scope.pid)) {
      alert('기존에 존재하는 프로젝트입니다.');
    }else {
      $http.get('http://192.168.1.101:8080/searchRoom'+'?pid='+$scope.pid).success(function(project) {
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

                  // 게시판 저장.

                  $cordovaFile.createDir(cordova.file.dataDirectory, "boards/"+$scope.pid, false)
                    .then(function (success) {
                      // success
                    }, function (error) {
                      // error
                    });

                    for (var i = 0; i < project.boardLength; i++) {
                      $cordovaFile.writeFile(cordova.file.dataDirectory, 'boards/'+$scope.pid+'/'+i+'.json', JSON.stringify(project.board[i]), true)
                        .then(function (success) {
                          // success
                        }, function (error) {
                          // error
                        });
                    }

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
