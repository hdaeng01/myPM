angular.module('App')
.controller('ChatsCtrl', function($scope, $ionicScrollDelegate, $stateParams, $cordovaFile, Chats, mySocket, getMyInfo, getRoomId) {
  $scope.messages = [];
  getRoomId.add($stateParams.chatId);
  $scope.chatRoom = Chats.get(getRoomId.get());
  mySocket.emit('joinRoom',getRoomId.get());

  $cordovaFile.readAsText(cordova.file.dataDirectory, getRoomId.get()+".json")
    .then(function (success) {
      // success
      var tmp = JSON.parse(success);
      if (tmp.chatContents.length>0) {
        for (var i = 0; i < tmp.chatContents.length; i++) {
          $scope.messages.push({sender:tmp.chatContents[i].sender , chatContent:tmp.chatContents[i].chatContent});
          console.log(tmp.chatContents[i].chatContent);
        }
      }
    }, function (error) {
      // error
    });

  mySocket.on('chatMessage', function(message){
    $scope.messages.push(message);
    console.log(message);
    console.log($scope.messages[0].text);
    // console.log($scope.messages[0].text);

    $cordovaFile.readAsText(cordova.file.dataDirectory, getRoomId.get()+".json")
      .then(function (success) {
        // success
        var tmp = JSON.parse(success);
        tmp.chatContents.push(message);

        $cordovaFile.writeFile(cordova.file.dataDirectory, getRoomId.get()+'.json', JSON.stringify(tmp), true)
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

  $scope.sendMessage = function(){
    var message = {
      roomId: getRoomId.get(),
      sender: getMyInfo.get(),
      chatContent: this.messageText
    };
    mySocket.emit('chatMessage', message);

    message = {
      sender: getMyInfo.get(),
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
    $cordovaFile.readAsText(cordova.file.dataDirectory, getRoomId.get()+".json")
      .then(function (success) {
        // success
        var tmp = JSON.parse(success);
        var data = {
          sender: getMyInfo.get(),
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
