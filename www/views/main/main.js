angular.module('App')
.controller('MainCtrl', function($scope, $stateParams, $ionicModal, Chats, $state, getRoomId, $ionicNavBarDelegate, $http, getMyInfo, $cordovaFile, Boards, $timeout, $ionicPush, push, $ionicHistory) {
  $scope.roomName='';
  $ionicNavBarDelegate.showBackButton(false);

  $cordovaFile.readAsText(cordova.file.dataDirectory, "myInfo.json")  // 파일에서 아이디와 이름정보를 꺼낸 후 getMyInfo 커스텀 서비스에 저장. 모든 뷰에서 꺼내 사용할 수 있게.
    .then(function (success) {
      // success
      var info = JSON.parse(success);
      getMyInfo.insertName(info.username);
      getMyInfo.insertEmail(info.id);
    }, function (error) {
      // error
    });

  var data = {
    pids : []
  };
  $cordovaFile.writeFile(cordova.file.dataDirectory, "pids.json", JSON.stringify(data), false)  //내가 속해있는 프로젝트들의 아이디를 저장하는 파일 생성.
    .then(function (success) {
      // success
    }, function (error) {
      // error
    });
  $cordovaFile.readAsText(cordova.file.dataDirectory, "pids.json")  //내가 속해있는 프로젝트들을 읽어온다.
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

        $http({
        method: 'POST' ,
        url: 'http://192.168.1.100:8080/createRoom',
        data: {
          pname: $scope.roomName,
          captain_id: getMyInfo.getEmail(),
          captain_name: getMyInfo.get(),
          token: token
        },
        headers: {
          'Content-Type': 'application/json'
        }
        }).success(function(pid) {
          Chats.add($scope.roomName,pid);
          $cordovaFile.readAsText(cordova.file.dataDirectory, "pids.json")  //pids파일에서 기존의 프로젝트들을 불러온 후 집어 넣어준다.
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
            $cordovaFile.writeFile(cordova.file.dataDirectory, pid+".json", JSON.stringify(data), false)  //해당 프로젝트 파일도 생성. 이곳에 채팅 내용을 저장.
              .then(function (success) {
                // success
                console.log(pid+'.json 파일 생성 성공');
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

                }, function (error) {
                  // error
                });
            }
          },function(error){

          })
      },function(error){

      });


      $http({
        method: 'POST' ,
        url: 'http://192.168.1.100:8080/removeRoom',
        data: {
          pid: chat.id,
          uid: getMyInfo.getEmail()
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).success(function(result) {

      });
    Chats.remove(chat);
  };

  $scope.goRoom = function(roomId){
    getRoomId.add(roomId);
    Boards.setEmpty();
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();

    $http({
      method: 'POST' ,
      url: 'http://192.168.1.100:8080/getBoard',
      data: {
        pid: roomId
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function(result) {
      var board = result.board;
      for (var i = 0; i < parseInt(result.boardLength); i++) {
        Boards.set(board[i].id, board[i].time, board[i].subject, board[i].content, board[i].name, board[i].hits, board[i].comments);
      }
      $state.go('tabs.board',{chatId:roomId});
    });
  }
})
