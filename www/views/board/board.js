angular.module('App')
.controller('BoardCtrl', function($scope, $state, $stateParams, $ionicModal, $http, $ionicNavBarDelegate, Projects, Board, PresentPid, MyInfo, HttpServ) {
  $scope.page = 0;
  $scope.total = 1;
  $scope.project = Projects.get($stateParams.pid);
  $scope.board = Board.all(); //처음에 Board서비스에 저장된 게시들을 불러와 뷰에 나타낸다.
  $scope.projectInfo = function(){
    $state.go('info');
  }

  $scope.getPage = function(){  //게시판 글 10개를 넘어가면 다음 10개를 서버에서 불러온다. ion-infinite-scroll를 이용해 무한 스크롤로 로딩.
    $scope.page++;
    $http({
      method: 'POST' ,
      url: HttpServ.url+'/getNextPage',
      data: {
        pid: PresentPid.get(),
        bid: Board.getLastId()
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function(result) {
      var board = result.board;
      for(var i = 0; i<board.length; i++){
        Board.set(board[i].id, board[i].time, board[i].subject, board[i].name, board[i].hits);
      };
      $scope.total = result.totalPage;
      $scope.board = Board.all();
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }).error(function(err){
      $scope.$broadcast('scroll.infiniteScrollComplete');
      console.log(err);
    });
  }

  $scope.edit = function(){ //게시글 작성은 modal창을 이용.
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
    var subject = this.subject;
    var content = this.content;

    $http({
      method: 'POST' ,
      url: HttpServ.url+'/addBoard',
      data: {
        pid: PresentPid.get(),
        subject: subject,
        content: content,
        id: MyInfo.getMyId(),
        name: MyInfo.getMyName()
      },
      headers: {
        'Content-Type': 'application/json'
      }
      }).success(function(result) {
        var board = result;
        for (var i = 0; i < board.length; i++) {
          Board.unshift(board[i].id, board[i].time, board[i].subject, board[i].name, board[i].hits, board[i].comments);
        }
        $scope.board = Board.all();
      })
      this.subject = ' ';
      this.content = ' ';
      $scope.hideModal();
    }
  }
)

.controller('BoardDetailCtrl', function($scope, $stateParams, $ionicHistory, $ionicNavBarDelegate, $http, $timeout, Projects, Board, PresentPid, MyInfo, HttpServ) {
  $ionicNavBarDelegate.showBackButton(true);
  Board.setHits($stateParams.boardId);
  $scope.board = Board.get($stateParams.boardId);
  $scope.project = Projects.get(PresentPid.get());
  $scope.comments = [];

  $http({
    method: 'POST' ,
    url: HttpServ.url+'/boardDetail',
    data: {
      bid: $stateParams.boardId
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }).success(function(result) {
    $scope.content = result.content;
    angular.forEach(result.comments, function(comment){
      $scope.comments.push(comment);
    })
  })

  $scope.addComment = function(){
    $scope.comment = this.comment;
    $http({
      method: 'POST' ,
      url: HttpServ.url+'/addComment',
      data: {
        bid: $stateParams.boardId,
        id: MyInfo.getMyId(),
        content: $scope.comment
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function(comments) {
      angular.forEach(comments, function(comment){
        $scope.comments.push(comment);
      })
    })
    this.comment = ' ';
  }

  $scope.deleteDetail = function(){
    $http({
      method: 'POST' ,
      url: HttpServ.url+'/deleteDetail',
      data: {
        id: MyInfo.getMyId(),
        bid: $stateParams.boardId
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function(result) {
      if (result=='삭제완료') {
        Board.removeBoard($stateParams.boardId);
        $ionicHistory.goBack();
      }
    })
  }
});
