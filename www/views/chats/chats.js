angular.module('App')
.controller('ChatsCtrl', function($scope, $ionicScrollDelegate, $stateParams, $http, HttpServ, Projects, MySocket, MyInfo, PresentPid) {
  $scope.messages = [];
  $scope.myId = MyInfo.getMyId();
  PresentPid.set($stateParams.pid);
  $scope.project = Projects.get(PresentPid.get());
  MySocket.emit('joinRoom',PresentPid.get());
  $scope.hideTime = true;

  $http({
    method: 'POST' ,
    url: HttpServ.url+'/getChat',
    data: {
      pid: PresentPid.get()
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }).success(function(message) {
    $scope.messages.push(message);
  });

  MySocket.on('chatMessage', function(message){
    console.log('message : '+message[0].id+' '+message[0].content);
    $scope.messages.push(message);
    $ionicScrollDelegate.resize();
    $ionicScrollDelegate.scrollBottom();
  });

  $scope.sendMessage = function(){
    var msgText = this.messageText;
    this.messageText = '';

    $scope.disableFlag = "false";
    var message = {
      id: MyInfo.getMyId(),
      pid: PresentPid.get(),
      sender: MyInfo.getMyName(),
      content: msgText
    };

    MySocket.emit('chatMessage', message);

    message = {
      sender: MyInfo.getMyName(),
      uid: MyInfo.getMyId(),
      content: msgText
    };

    $scope.pushMessage(message);
  }

  MySocket.on('$destroy', function(){
    MySocket.removeListener('chatMessage');
  });

  $scope.pushMessage = function(message){
    $scope.messages.push(message);
    $ionicScrollDelegate.resize();
    $ionicScrollDelegate.scrollBottom();
  }

  $scope.focused = function() {
    $ionicScrollDelegate.resize();
    $ionicScrollDelegate.scrollBottom();
  }

  $scope.blurred = function() {
    $scope.disableFlag = "true";
    $ionicScrollDelegate.resize();
    $ionicScrollDelegate.scrollBottom();
  }
})
