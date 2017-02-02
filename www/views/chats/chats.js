angular.module('App')
.controller('ChatsCtrl', function($scope, $ionicScrollDelegate, $stateParams, Chats, mySocket, getMyInfo, getRoomId) {
  $scope.messages = [];
  getRoomId.add($stateParams.chatId);
  $scope.chatRoom = Chats.get(getRoomId.get());
  mySocket.emit('joinRoom',getRoomId.get());

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

    $scope.messages.push(message);
    mySocket.emit('chatMessage', message);
    this.messageText = '';
  }

  mySocket.on('$destroy', function(){
    mySocket.removeListener('chatMessage');
  });
})
