angular.module('App')
.controller('ChatsCtrl', function($scope, $ionicScrollDelegate, $stateParams, $cordovaFile, Chats, mySocket, getMyInfo, getRoomId) {
  $scope.messages = [];
  getRoomId.add($stateParams.chatId);
  $scope.chatRoom = Chats.get(getRoomId.get());
  mySocket.emit('joinRoom',getRoomId.get());

  $cordovaFile.readAsText(cordova.file.dataDirectory, getRoomId.get()+".txt")
    .then(function (success) {
      // success
      var contents=success.split('\n');
      if (contents.length>2) {
        for (var i = 1; i < contents.length-2; i+=2) {
          $scope.messages.push({sender:contents[i],chatContent:contents[i+1]});
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
    $cordovaFile.writeExistingFile(cordova.file.dataDirectory, getRoomId.get()+'.txt', message.sender+'\n'+message.chatContent+'\n')
      .then(function (success) {
        // success
      }, function (error) {
        // error
      });
  }
})
