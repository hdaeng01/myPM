angular.module('App')
.controller('BoardCtrl', function($scope, $stateParams, $ionicModal, $http, Chats, Boards, $ionicNavBarDelegate, getRoomId, getMyInfo, $cordovaFile) {
  $scope.chatRoom = Chats.get($stateParams.chatId);
  $scope.board = Boards.get($stateParams.boardId);
  $scope.page = 0;
  $scope.total = 1;

  $scope.getPage = function(){
    $scope.page++;
    $http.get('http://192.168.1.101:8080/getPage'+'?pid='+getRoomId.get()+'&page='+$scope.page)
    .success(function(result) {
      for(var i = 0; i<result.board.length; i++){
        Boards.set(result.board[i].id, result.board[i].time, result.board[i].subject, result.board[i].content, result.board[i].name, result.board[i].hits, result.board[i].comments);
      };
      $scope.total = result.totalPages;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }).error(function(err){
      $scope.$broadcast('scroll.infiniteScrollComplete');
      console.log(err);
    });
  }

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
    var time = new Date();
    var subject = this.subject;
    var content = this.content;

    Chats.setBoardLength($stateParams.chatId);

    $cordovaFile.readAsText(cordova.file.dataDirectory, "myInfo.json")
      .then(function (success) {
        // success
        var tmp = JSON.parse(success);
        var token = tmp.token;
        $http.get('http://192.168.1.101:8080/addBoard'+'?pid='+getRoomId.get()+'&subject='+subject+'&content='+content+'&time='+time+'&name='+getMyInfo.get()+'&token='+token)
        .success(function(result) {
          Boards.unshift(result, time, subject, content, getMyInfo.get(), 0, []);
          $scope.boards = Boards.all();
          $scope.hideModal();
        })
      })
    }
  }
)

.controller('BoardDetailCtrl', function($scope, $stateParams, $ionicNavBarDelegate, $http, Boards, getRoomId, $cordovaFile, getMyInfo, $timeout) {
  $timeout(function(){
    Boards.setHits($stateParams.boardId);
  },500);

  $ionicNavBarDelegate.showBackButton(true);
  $scope.board = Boards.get($stateParams.boardId);
  $scope.comments = $scope.board.comments;

  $http.get('http://192.168.0.4:8080/setHits'+'?pid='+getRoomId.get()+'&title='+$stateParams.boardId)
    .success(function(result) {

    })

  $scope.addComment = function(){
    $scope.comment = this.comment;
    $scope.comments.push({name:getMyInfo.get(), comment:$scope.comment});
    var boardId = $stateParams.boardId;

    $http.get('http://192.168.1.101:8080/setComments'+'?pid='+getRoomId.get()+'&title='+boardId+'&name='+getMyInfo.get()+'&content='+$scope.comment)
      .success(function(result){

      });
    this.comment = ' ';
  }
});
