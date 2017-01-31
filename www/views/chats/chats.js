angular.module('App')
.controller('ChatsCtrl', function($scope, $ionicScrollDelegate, $stateParams, Chats, mySocket, getMyInfo, $cordovaSQLite) {
  $scope.messages = [];
  $scope.chatRoom = Chats.get($stateParams.chatId);

  // var sql = "SELECT sender, chatContent FROM chats WHERE id = ?";
  // $cordovaSQLite.execute(db, sql, [$scope.chatRoom.id]).then(function(res) {
  //     if(res.rows.length > 0) {
  //         console.log("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname);
  //         for (var i = 0; i < res.rows.length; i++) {
  //           messages.push(res.rows[i]);
  //         }
  //         mySocket.emit('joinRoom',$scope.chatRoom.id);
  //     } else {
  //         console.log("No results found");
  //     }
  // }, function (err) {
  //     console.error(err);
  // });

  mySocket.on('chatMessage', function(message){
    $scope.messages.push(message);
    console.log(message);
    console.log($scope.messages[0].text);
    // console.log($scope.messages[0].text);

    $ionicScrollDelegate.scrollBottom();
  });

  $scope.sendMessage = function(){
    var message = {
      sender: getMyInfo.get(),
      chatContent: this.messageText
    };

    // var sql = "INSERT INTO chats VALUES (?)";
    // $cordovaSQLite.execute(db, sql, [message]).then(function(res) {
    //     console.log("INSERT ID -> " + res.insertId);
    // }, function (err) {
    //     console.error(err);
    // });
    
    $scope.messages.push(message);
    mySocket.emit('chatMessage', message);
    this.messageText = '';
  }

  mySocket.on('$destroy', function(){
    mySocket.removeListener('chatMessage');
  });
})
