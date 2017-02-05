angular.module('App')
.controller('MainCtrl', function($scope, $stateParams, $ionicModal, Chats, $state, getRoomId, $ionicNavBarDelegate, $http, getMyInfo, $cordovaFile, Boards, $timeout) {
  $scope.roomName='';
  $ionicNavBarDelegate.showBackButton(false);

  $cordovaFile.readAsText(cordova.file.dataDirectory, "myInfo.json")
    .then(function (success) {
      // success
      var tmp = JSON.parse(success);
      getMyInfo.insertName(tmp.username);
      getMyInfo.insertEmail(tmp.id);
      alert(tmp.username + ' ' + tmp.id);
    }, function (error) {
      // error
    });

  var data = {
    pids : []
  };

  $cordovaFile.writeFile(cordova.file.dataDirectory, "pids.json", JSON.stringify(data), false)
    .then(function (success) {
      // success
      alert("pids.json 생성");
    }, function (error) {
      // error

    });

  $cordovaFile.readAsText(cordova.file.dataDirectory, "pids.json")
    .then(function (success) {
      // success
      var tmp = JSON.parse(success);
      for (var i = 0; i < tmp.pids.length; i++) {
        Chats.add(tmp.pids[i].projectName, tmp.pids[i].pid);
      }
      alert('read pids.json to Chats.add');
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

    $http.get('http://192.168.1.101:8080/createRoom'+'?pname='+$scope.roomName+'&captain_id='+getMyInfo.getEmail()).success(function(pid) {
      Chats.add($scope.roomName,pid);
      var data = {
        pid : pid,
        projectName : $scope.roomName;
      };
      $cordovaFile.readAsText(cordova.file.dataDirectory, "pids.json")
        .then(function (success) {
          // success
          var tmp = JSON.parse(success);
          tmp.pids.push(data);
          $cordovaFile.writeFile(cordova.file.dataDirectory, "pids.json", JSON.stringify(tmp), true)
            .then(function (success) {
              // success
              $cordovaFile.createDir(cordova.file.dataDirectory, "boards", false)
                .then(function (success) {
                  // success
                }
              var data = {
                projectName : $scope.roomName,
                chatContents : []
              };
              $cordovaFile.writeFile(cordova.file.dataDirectory, pid+".json", JSON.stringify(data), false)
                .then(function (success) {
                  // success
                  $cordovaFile.createDir(cordova.file.dataDirectory, "boards/"+pid, true)
                    .then(function (success) {
                      // success
                    }
                }
            }
        }
    });
    this.roomName = '';
    $scope.hideModal();
  };

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    $cordovaFile.removeFile(cordova.file.dataDirectory, chat.id+".json")
      .then(function (success) {
        // success
        $cordovaFile.readAsText(cordova.file.dataDirectory, "pids.json")
          .then(function (success) {
            // success
            var tmp = JSON.parse(success);
            for (var i = 0; i < tmp.pids.length; i++) {
              if (tmp.pids[i].pid==chat.id) {
                tmp.pids.splice(i,1);
                break;
              }
            }
            $cordovaFile.writeFile(cordova.file.dataDirectory, "pids.json", JSON.stringify(tmp), true)
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

      for (var i = 0; i < Chats.getBoardLength(chat.id); i++) {
        $cordovaFile.removeFile(cordova.file.dataDirectory, "boards/"+chat.id+"/"+i+".json")
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

      $http.get('http://192.168.1.101:8080/removeRoom'+'?pid='+chat.id+'&uid='+getMyInfo.getEmail())
        .success(function(result) {

        });

      Chats.remove(chat);
  };

  $scope.goRoom = function(roomId){
    getRoomId.add(roomId);
    Boards.setEmpty();
    $http.get('http://192.168.1.101:8080/getBoardLength'+'?pid='+roomId)
    .success(function(result) {
      result = parseInt(result);
      for (var i = (result-1); i >= 0; i--) {
        $cordovaFile.readAsText(cordova.file.dataDirectory, 'boards/'+roomId+'/'+i+'.json')
          .then(function (success) {
            // success
            var tmp = JSON.parse(success);
            Boards.set(tmp.id, tmp.time, tmp.title, tmp.content, tmp.name, tmp.hits);
          }, function (error) {
            // error
          });
      }
      $state.go('tabs.board',{chatId:roomId});
    })
  }
})
