angular.module('App')
.controller('ChatsCtrl', function($scope, $ionicScrollDelegate, $stateParams, $cordovaFile, Chats, mySocket, getMyInfo, getRoomId) {
  $scope.myId = getMyInfo.getEmail();
  $scope.messages = [];
  getRoomId.add($stateParams.chatId);
  $scope.chatRoom = Chats.get(getRoomId.get());
  mySocket.emit('joinRoom',getRoomId.get());
  $scope.hideTime = true;

  $cordovaFile.readAsText(cordova.file.dataDirectory, getRoomId.get()+".json")
    .then(function (success) {
      // success
      var tmp = JSON.parse(success);
      if (tmp.chatContents.length>0) {
        for (var i = 0; i < tmp.chatContents.length; i++) {
          $scope.messages.push({sender:tmp.chatContents[i].sender ,chatContent:tmp.chatContents[i].chatContent, uid:tmp.chatContents[i].uid});
        }
        $ionicScrollDelegate.scrollBottom();
      }
    }, function (error) {
      // error
    });

  document.addEventListener('deviceready', function () {
    // cordova.plugins.backgroundMode is now available

    mySocket.on('chatMessage', function(message){
      $scope.messages.push(message);
      // console.log($scope.messages[0].text);
      $cordovaFile.readAsText(cordova.file.dataDirectory, message.roomId+".json")
        .then(function (success) {
          // success
          var tmp = JSON.parse(success);
          tmp.chatContents.push(message);
          $cordovaFile.writeFile(cordova.file.dataDirectory, message.roomId+'.json', JSON.stringify(tmp), true)
            .then(function (success) {
              // success
            }, function (error) {
              // error
            });
        }, function (error) {
          // error
        });
      $ionicScrollDelegate.scrollBottom();
    });

  }, false);

  $scope.sendMessage = function(){
    var message = {
      roomId: getRoomId.get(),
      sender: getMyInfo.get(),
      uid: getMyInfo.getEmail(),
      chatContent: this.messageText
    };
    mySocket.emit('chatMessage', message);

    message = {
      sender: getMyInfo.get(),
      uid: getMyInfo.getEmail(),
      chatContent: this.messageText
    };
    this.messageText = '';
    $scope.pushMessage(message);
  }

  mySocket.on('$destroy', function(){
    mySocket.removeListener('chatMessage');
  });

  $scope.pushMessage = function(message){
    $scope.messages.push(message);
    $ionicScrollDelegate.scrollBottom();
    $cordovaFile.readAsText(cordova.file.dataDirectory, getRoomId.get()+".json")
      .then(function (success) {
        // success
        var tmp = JSON.parse(success);
        var data = {
          sender: getMyInfo.get(),
          uid: getMyInfo.getEmail(),
          chatContent: message.chatContent
        }
        tmp.chatContents.push(data);
        $cordovaFile.writeFile(cordova.file.dataDirectory, getRoomId.get()+'.json', JSON.stringify(tmp), true)
          .then(function (success) {
            // success
            console.log(message.chatContent+'쓰기 성공');
          }, function (error) {
            // error
          });
      }, function (error) {
        // error
      });
  }
})
