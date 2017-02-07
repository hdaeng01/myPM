angular.module('App')
.controller('MainCtrl', function($scope, $stateParams, $ionicModal, Chats, $state, getRoomId, $ionicNavBarDelegate, $http, getMyInfo, $cordovaFile, Boards, $timeout) {
  $scope.roomName='';
  $ionicNavBarDelegate.showBackButton(false);

  $cordovaFile.readAsText(cordova.file.dataDirectory, "myInfo.json")
    .then(function (success) {
      // success
      var info = JSON.parse(success);
      getMyInfo.insertName(info.username);
      getMyInfo.insertEmail(info.id);
      // alert(info.username+' , '+info.id+' , '+info.route);
    }, function (error) {
      // error
    });

  var data = {
    pids : []
  };
  $cordovaFile.writeFile(cordova.file.dataDirectory, "pids.json", JSON.stringify(data), false)
    .then(function (success) {
      // success
    }, function (error) {
      // error
    });

  $cordovaFile.createDir(cordova.file.dataDirectory, "boards", false)
    .then(function (success) {
      // success
    }, function (error) {
      // error
    });

  $cordovaFile.readAsText(cordova.file.dataDirectory, "pids.json")
    .then(function (success) {
      // success
      var p = JSON.parse(success);

      if (p.pids.length>0) {
        for (var i = 0; i < p.pids.length; i++) {
          Chats.add(p.pids[i].projectName , p.pids[i].pid);
        }
      }}, function (error) {
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
      $cordovaFile.readAsText(cordova.file.dataDirectory, "pids.json")
        .then(function(success){
          var p = JSON.parse(success);
          p.pids.push({pid : pid , projectName : $scope.roomName});
          $cordovaFile.writeFile(cordova.file.dataDirectory, "pids.json", JSON.stringify(p), true)
            .then(function (success) {
              // success
            }, function (error) {
              // error
            });
        }, function(error){

        });

      var data = {
        projectName: $scope.roomName,
        chatContents: []
      }
      $cordovaFile.writeFile(cordova.file.dataDirectory, pid+".json", JSON.stringify(data), false)
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
    });
    this.roomName = '';
    $scope.hideModal();
  };

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    $cordovaFile.removeFile(cordova.file.dataDirectory, chat.id+".json")
      .then(function(success){
        $cordovaFile.readAsText(cordova.file.dataDirectory, "pids.json")
          .then(function (success) {
            var p = JSON.parse(success);
            if (p.pids.length>0) {
              for (var i = 0; i < p.pids.length; i++) {
                if (p.pids[i].pid==chat.id) {
                  p.pids.splice(i,1);
                  break;
                }
              }
            }
          },function(error){

          })
      },function(error){

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
      }, function (error) {
        // error
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
            Boards.set(tmp.id, tmp.time, tmp.subject, tmp.content, tmp.name, tmp.hits);
          }, function (error) {
            // error
          });
      }
      $state.go('tabs.board',{chatId:roomId});
    })
  }
})
