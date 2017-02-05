angular.module('App')
.controller('BoardCtrl', function($scope, $stateParams, $ionicModal, $http, Chats, Boards, $ionicNavBarDelegate, getRoomId, getMyInfo, $cordovaFile) {
  $scope.chatRoom = Chats.get($stateParams.chatId);
  $scope.board = Boards.get($stateParams.boardId);

  $scope.boards = Boards.all();
  getRoomId.add($stateParams.chatId);

  $scope.edit = function(){
    if ($scope.modal) {
      $scope.modal.show();
    } else {
      $ionicModal.fromTemplateUrl('views/board/edit.html',{
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

  $scope.addBoard = function(){
    var id = Boards.getLength();
    var time = new Date();
    var subject = this.subject;
    var content = this.content;

    Chats.setBoardLength($stateParams.chatId);
    Boards.set(id, getMyInfo.get(), subject, content, time, 0, []);
    $scope.boards = Boards.all();
    $http.get('http://192.168.1.101:8080/addBoard'+'?pid='+getRoomId.get()+'&title='+this.subject+'&content='+this.content+'&id='+id+'&time='+time+'&name='+getMyInfo.get())
    .success(function(result) {
      var data = {
        id: id,
        time: time,
        subject: subject,
        content: content,
        name: getMyInfo.get(),
        hits: '0',
        comments: []
      }
      $cordovaFile.writeFile(cordova.file.dataDirectory, "boards/"+getRoomId.get()+'/'+result+'.json', JSON.stringify(data), true)
        .then(function (success) {
          // success
          this.subject = '';
          this.content = '';
          alert('완료');
          $scope.hideModal();
        }, function (error) {
          // error
        });
    })
  }
})

.controller('BoardDetailCtrl', function($scope, $stateParams, $ionicNavBarDelegate, $http, Boards, getRoomId, $cordovaFile, getMyInfo, $timeout) {
  $timeout(function(){
    Boards.setHits($stateParams.boardId);
  },500);

  $scope.comments = [];
  $cordovaFile.readAsText(cordova.file.dataDirectory, 'boards/'+getRoomId.get()+'/'+$stateParams.boardId+'.json')
    .then(function(result){
      var tmp = JSON.parse(result);
      for(var comment in tmp.comments){
        $scope.comments.push({name : comment.name , content : comment.content});
      }
      // var tmp = result.split('\n');
      // var comments = tmp[6];
      // var comment = comments.split('*!%#@');
      // for (var i = 0; i < comment.length-2; i+=2) {
      //   $scope.comments.push({name : comment[i] , content : comment[i+1]})
      // }
    });

  $ionicNavBarDelegate.showBackButton(true);
  $scope.board = Boards.get($stateParams.boardId);
  // $scope.comments = $scope.board.comments;

  $http.get('http://192.168.1.101:8080/setHits'+'?pid='+getRoomId.get()+'&title='+$stateParams.boardId)
    .success(function(result) {
      $cordovaFile.readAsText(cordova.file.dataDirectory, 'boards/'+getRoomId.get()+'/'+$stateParams.boardId+'.json')
        .then(function (success) {
          // success
          var tmp = JSON.parse(success);
          var hits = parseInt(tmp.hits);
          hits = (++hits).toString();
          tmp.hits = hits;

          $cordovaFile.writeFile(cordova.file.dataDirectory, 'boards/'+getRoomId.get()+'/'+$stateParams.boardId+'.json', JSON.stringify(tmp), true)
            .then(function (success) {
              // success
            }, function (error) {
              // error
            });
        }, function (error) {
          // error
        });
    })

  $scope.addComment = function(){
    $scope.comment = this.comment;
    $scope.comments.push({name:getMyInfo.get(), content:$scope.comment});

    $cordovaFile.readAsText(cordova.file.dataDirectory, 'boards/'+getRoomId.get()+'/'+$stateParams.boardId+'.json')
      .then(function (success) {
        var tmp = JSON.parse(success);
        var data = {
          name: getMyInfo.get(),
          comment: $scope.comment
        }
        tmp.comments.push(JSON.stringify(data));
        $cordovaFile.writeFile(cordova.file.dataDirectory, 'boards/'+getRoomId.get()+'/'+$stateParams.boardId+'.json', tmp, true)
          .then(function (success) {
            // success
          }, function (error) {
            // error
          });
      })

    $http.get('http://192.168.1.101:8080/setComments'+'?pid='+getRoomId.get()+'&title='+$scope.board.id+'&name='+getMyInfo.get()+'&content='+$scope.comment)
      .success(function(result){

      });

    this.comment = ' ';
  }
});
