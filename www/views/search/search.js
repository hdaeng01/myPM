angular.module('App')
.controller('SearchCtrl', function($scope, $stateParams, $http, $state, $cordovaFile, Chats) {
  $scope.searchRoom = function(){
    $scope.pid = this.pid;
    if (Chats.get($scope.pid)) {
      alert('기존에 존재하는 프로젝트입니다.');
    }else {
      $http.get('http://192.168.1.101:8080/searchRoom'+'?pid='+$scope.pid).success(function(project) {
        if (project.exist) {
          Chats.add(project.pname, $scope.pid);
          $cordovaFile.readAsText(cordova.file.dataDirectory, "pids.json")
            .then(function(success){
              var p = JSON.parse(success);
              p.pids.push({pid : $scope.pid , projectName : project.pname});
              $cordovaFile.writeFile(cordova.file.dataDirectory, "pids.json", JSON.stringify(p), true)
                .then(function (success) {
                  // success

                  // 게시판 저장.
                  alert(project.boardLength);
                  alert($scope.pid);
                  $cordovaFile.createDir(cordova.file.dataDirectory, "boards/"+$scope.pid, false)
                    .then(function (success) {
                      // success
                      alert("boards/"+$scope.pid+'디렉토리 생성성공');
                      // var jj = JSON.parse(project.board);
                      // alert(jj[0].contents);
                      //게시판을 배열로 받아오는 과정에서 문제가 있음.
                      alert(project.board);
                      for (var i = 0; i < project.boardLength; i++) {
                        alert(i);
                        $cordovaFile.writeFile(cordova.file.dataDirectory, 'boards/'+$scope.pid+'/'+i+'.json', project.board[i].content, true)
                          .then(function (success) {
                            // success
                            alert('boards/'+$scope.pid+'/'+i+'.json '+i+'번째 게시물 저장완료');
                          }, function (error) {
                            // error
                          });
                      }
                    }, function (error) {
                      // error
                    });

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
