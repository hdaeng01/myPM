angular.module('App')
.controller('MainCtrl', function($scope, $stateParams, $ionicModal, Chats, $state, getRoomId, $ionicNavBarDelegate, $http, getMyInfo, $cordovaFile, Boards, $timeout, $ionicPush, push) {
  $ionicPush.register().then(function(t) {
    return $ionicPush.saveToken(t);
  }).then(function(t) {
    console.log('Token saved:'+ t.token);
  });

  $scope.$on('cloud:push:notification', function(event, data) {
    
    var msg = data.message;
    alert('<text> ' + msg.title + ': ' + msg.text);
    // push.set(msg);
    // var tmp = push.get();
    // alert('test!!'+tmp.title);
  });

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
          Chats.add(p.pids[i].projectName , p.pids[i].pid , p.pids[i].boardLength);
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

    $cordovaFile.readAsText(cordova.file.dataDirectory, "myInfo.json")
      .then(function (success) {
        // success
        var tmp = JSON.parse(success);
        var token = tmp.token;
        $http.get('http://192.168.1.101:8080/createRoom'+'?pname='+$scope.roomName+'&captain_id='+getMyInfo.getEmail()+'&token='+token).success(function(pid) {
          Chats.add($scope.roomName,pid);
          $cordovaFile.readAsText(cordova.file.dataDirectory, "pids.json")
            .then(function(success){
              var p = JSON.parse(success);
              p.pids.push({pid : pid , projectName : $scope.roomName , boardLength : 0});
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
      });

    this.roomName = '';
    $scope.hideModal();
  };

  $scope.chats = Chats.all();

  $scope.remove = function(chat) {
    var bl;
    $cordovaFile.removeFile(cordova.file.dataDirectory, chat.id+".json")  //채팅 내용이 쓰여있는 projectId.json파일을 먼저 지운다.
      .then(function(success){
        $cordovaFile.readAsText(cordova.file.dataDirectory, "pids.json")  //프로젝트 파일들이 저장되어 있는 pids.json에서 해단 프로젝트 아이디를 지운다.
          .then(function (success) {
            var p = JSON.parse(success);
            if (p.pids.length>0) {
              for (var i = 0; i < p.pids.length; i++) {
                if (p.pids[i].pid==chat.id) {
                  bl = p.pids[i].boardLength; //pids의 해당 프로젝트의 게시판 길이를 가져온다.
                  p.pids.splice(i,1);
                  break;
                }
              }
              $cordovaFile.writeFile(cordova.file.dataDirectory, "pids.json", JSON.stringify(p), true) //지운 후 그것을 다시 저장
                .then(function (success) {
                  // success
                  for (var i = 0; i < bl; i++) { //프로젝트에 있던 게시판내용 삭제
                    $cordovaFile.removeFile(cordova.file.dataDirectory, "boards/"+chat.id+"/"+i+".json")
                      .then(function(success){
                      },function(error){

                      });
                  }
                  $cordovaFile.removeDir(cordova.file.dataDirectory, "boards/"+chat.id) //프로젝트 게시판 디렉토리 삭제
                    .then(function (success) {
                      // success
                    }, function (error) {
                      // error
                    });
                }, function (error) {
                  // error
                });
            }
          },function(error){

          })
      },function(error){

      });

    $http.get('http://192.168.1.101:8080/removeRoom'+'?pid='+chat.id+'&uid='+getMyInfo.getEmail())  //서버 게시판 삭제
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
      for (var i = 0; i < result; i++) {
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
