angular.module('App')
.controller('BoardCtrl', function($scope, $stateParams, $ionicModal, $http, Chats, Boards, $ionicNavBarDelegate, getRoomId, getMyInfo) {
  $scope.chatRoom = Chats.get($stateParams.chatId);
  $scope.board = Boards.get($stateParams.boardId);
  $http.get('http://192.168.0.4:8080/getBoard'+'?pid='+getRoomId.get())
  .success(function(result) {
    alert(result[0].title);
    for (var i = 0; i < result.length; i++) {
      alert(result[i].title);
    }
  })

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
    Boards.set(getMyInfo.get(), this.subject, this.content);
    $http.get('http://192.168.0.4:8080/addBoard'+'?pid='+getRoomId.get()+'&title='+this.subject+'&content='+this.content)
    .success(function(result) {
      if (result==complete) {
        alert('글올리기 성공');
      }
    })
    $scope.hideModal();
  }
})

.controller('BoardDetailCtrl', function($scope, $stateParams, $ionicNavBarDelegate, Boards) {
  $ionicNavBarDelegate.showBackButton(true);
  $scope.board = Boards.get($stateParams.boardId);
  $scope.comments = $scope.board.comments;

  $scope.add = function(){
    $scope.comment = this.comment;
    $scope.board.comments.push({name:'익명',content:$scope.comment});
    this.comment = ' ';
  }
});
