angular.module('App')
.controller('MainCtrl', function($scope, $stateParams, $ionicModal, Chats, $state, getRoomId, $ionicNavBarDelegate, $http, getMyInfo, $cordovaFile, Boards, $timeout) {
  $scope.roomName='';
  $ionicNavBarDelegate.showBackButton(false);

  $cordovaFile.readAsText(cordova.file.dataDirectory, "myInfo.txt")
    .then(function (success) {
      // success
      if (success) {
        var info = success.split('\n');
        getMyInfo.insertName(info[1]);
        getMyInfo.insertEmail(info[2]);
      }
    }, function (error) {
      // error
    });

  $cordovaFile.createFile(cordova.file.dataDirectory, "pids", false)
    .then(function (success) {
      // success

    }, function (error) {
      // error

    });

  $cordovaFile.readAsText(cordova.file.dataDirectory, "pids")
    .then(function (success) {
      // success
      if (success) {
        var projects = success.split('/');
        for (var i = 0; i < projects.length-2; i+=2) {
          Chats.add(projects[i+1],projects[i]);
        }
      }
    }, function (error) {
      // error
    });

  $scope.showModal = function(){
    if ($scope.modal) {
      $scope.modal.show();
    } else {
      $ionicModal.fromTemplateUrl('views/main/modal-create.html',{
        scope:$scope
      }).then(function(modal){
        $scope.modal = modal;
        $scope.modal.show();
      });
    }
  };

  $scope.hideModal = function(){
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function(){
    $scope.modal.remove();
  });

  $scope.createRoom = function(){
    $scope.roomName = this.roomName;

    $http.get('http://192.168.0.4:8080/createRoom'+'?pname='+$scope.roomName+'&captain_id='+getMyInfo.getEmail()).success(function(pid) {
      Chats.add($scope.roomName,pid);
      $cordovaFile.writeExistingFile(cordova.file.dataDirectory, "pids", pid+'/'+$scope.roomName+'/')
        .then(function (success) {
          // success
          $cordovaFile.createDir(cordova.file.dataDirectory, "boards", false)
            .then(function (success) {
              // success
            }, function (error) {
              // error
            });
          $cordovaFile.writeFile(cordova.file.dataDirectory, pid+".txt", $scope.roomName+'\n', false)
            .then(function (success) {
              // success
              $cordovaFile.createDir(cordova.file.dataDirectory, "boards/"+pid, true)
                .then(function (success) {
                  // success
                }, function (error) {
                  // error
                });
            }, function (error) {
              // error
            });
        }, function (error) {
          // error

        });
    });
    this.roomName = '';
    $scope.hideModal();
  };

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    $cordovaFile.removeFile(cordova.file.dataDirectory, chat.id+".txt")
      .then(function (success) {
        // success
        $cordovaFile.readAsText(cordova.file.dataDirectory, "pids")
          .then(function (success) {
            // success
            if (success) {
              var projects = success.split('/');
              for (var i = 0; i < projects.length-2; i+=2) {
                if (projects[i]==chat.id) {
                  projects.splice(i,2);
                  break;
                }
              }
              var str = projects.join('/');
              $cordovaFile.writeFile(cordova.file.dataDirectory, "pids", str, true)
                .then(function (success) {
                  // success
                }, function (error) {
                  // error
                });
            }
          }, function (error) {
            // error
          });
      }, function (error) {
        // error
      });

      for (var i = 0; i < Chats.getBoardLength(chat.id); i++) {
        $cordovaFile.removeFile(cordova.file.dataDirectory, "boards/"+chat.id+"/"+i+".txt")
          .then(function(success){

          },function(error){

          });
      }

    $cordovaFile.removeDir(cordova.file.dataDirectory, "boards/"+chat.id)
      .then(function (success) {
        // success
        alert('로컬 디렉토리 모두 삭제');
      }, function (error) {
        // error
        alert('디렉토리 삭제 실패');
      });

      $http.get('http://192.168.0.4:8080/removeRoom'+'?pid='+chat.id+'&uid='+getMyInfo.getEmail())
        .success(function(result) {

        });

      Chats.remove(chat);
  };

  $scope.goRoom = function(roomId){
    getRoomId.add(roomId);
    Boards.setEmpty();
    $http.get('http://192.168.0.4:8080/getBoardLength'+'?pid='+roomId)
    .success(function(result) {
      result = parseInt(result);
      for (var i = (result-1); i >= 0; i--) {
        $cordovaFile.readAsText(cordova.file.dataDirectory, 'boards/'+roomId+'/'+i+'.txt')  //여기 동기화 필요..
          .then(function (success) {
            // success
            var tmp = success.split('\n');
            Boards.set(tmp[0], tmp[1], tmp[2], tmp[3], tmp[4], tmp[5]);
          }, function (error) {
            // error
          });
      }
      $state.go('tabs.board',{chatId:roomId});
    })
  }
})
