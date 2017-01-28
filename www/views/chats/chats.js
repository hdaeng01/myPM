angular.module('App')
.controller('ChatsCtrl', function($scope, $ionicScrollDelegate, $stateParams, Chats, mySocket) {
  $ionicNavBarDelegate.showBackButton(true);
  $scope.messages = [];
  $scope.chatRoom = Chats.get($stateParams.chatId);
  function joinRoom(){
    mySocket.emit('joinRoom',$scope.chatRoom.id);
  }
  joinRoom();

  mySocket.on('chatMessage', function(message){
    $scope.messages.push(message);
    console.log(message);
    console.log($scope.messages[0].text);
    // console.log($scope.messages[0].text);

    $ionicScrollDelegate.scrollBottom();
  });

  $scope.sendMessage = function(){
    var message = {
      text: this.messageText
    };

    mySocket.emit('chatMessage', message);

    this.messageText = '';
  }

  mySocket.on('$destroy', function(){
    mySocket.removeListener('chatMessage');
  });
})

// .controller('ChatDetailCtrl', function($scope, $ionicScrollDelegate, $stateParams, Chats, mySocket) {
//   $scope.messages = [];
//   $scope.chatRoom = Chats.get($stateParams.chatId);
//   function joinRoom(){
//     mySocket.emit('joinRoom',$scope.chatRoom.id);
//   }
//   joinRoom();
//
//   console.log($scope.chatRoom.id);
//
//   mySocket.on('chatMessage', function(message){
//     $scope.messages.push(message);
//     console.log(message);
//     console.log($scope.messages[0].text);
//     // console.log($scope.messages[0].text);
//
//     $ionicScrollDelegate.scrollBottom();
//   });
//
//   $scope.sendMessage = function(){
//     var message = {
//       text: this.messageText
//     };
//
//     mySocket.emit('chatMessage', message);
//
//     this.messageText = '';
//   }
//
//   mySocket.on('$destroy', function(){
//     mySocket.removeListener('chatMessage');
//   });
// });
