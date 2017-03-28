angular.module('App')
.controller('ChatsCtrl', function($scope, $ionicScrollDelegate, $stateParams, $state, $timeout, $http, HttpServ, Projects, MySocket, MyInfo, PresentPid, dateServ) {
  $scope.messages = [];
  $scope.myId = MyInfo.getMyId();
  PresentPid.set($stateParams.pid);
  $scope.project = Projects.get(PresentPid.get());
  MySocket.emit('joinRoom',PresentPid.get());
  $scope.hideTime = true;
  $scope.page = 0;

  $scope.projectInfo = function(){
    $state.go('info',{pid:$stateParams.pid});
  }

  $scope.getChat = function(){  //게시판 글 10개를 넘어가면 다음 10개를 서버에서 불러온다. ion-infinite-scroll를 이용해 무한 스크롤로 로딩.
    console.log('id : '+MyInfo.getMyId());
    $http({
      method: 'POST' ,
      url: HttpServ.url+'/getChat',
      data: {
        id: MyInfo.getMyId(),
        pid: PresentPid.get(),
        page: $scope.page
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function(messages) {
      for (var i = 0; i < messages.length; i++) {
        $scope.messages.unshift(messages[i]);
      }
      // $ionicScrollDelegate.resize();

      if ($scope.page==0) {
        $scope.page++;
        $ionicScrollDelegate.scrollBottom();
      }

    }).finally(function(){
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
  $scope.getChat();

  MySocket.on('chatMessage', function(message){
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
      id: MyInfo.getMyId(),
      created: new Date(),
      content: msgText
    };

    $scope.pushMessage(message);
  }

  MySocket.on('$destroy', function(){
    MySocket.removeListener('chatMessage');
  });

  $scope.format = dateServ.format;
  $scope.pushMessage = function(message){
    console.log(message.id);
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

.filter('datetime', function($filter)
{
 return function(input)
 {
  if(input == null){ return ""; }
  var _date = $filter('date')(new Date(input), 'yyyy-MM-dd HH:mm:ss');
  return _date.toUpperCase();
 };
});
