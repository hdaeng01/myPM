angular.module('App')
.controller('ChatController', function($scope, $ionicScrollDelegate, mySocket) {
  $scope.messages = [];

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

  $scope.$on('$destroy', function(){
    mySocket.removeListener('chatMessage');
  });
});
