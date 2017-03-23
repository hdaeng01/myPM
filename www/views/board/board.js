angular.module('App')
.controller('BoardCtrl', function($scope, $state, $stateParams, $ionicModal, $http, Projects, Board, $ionicNavBarDelegate, PresentPid, MyInfo, $cordovaFile, HttpServ) {
  $scope.project = Projects.get($stateParams.pid);
  // $scope.board = Boards.get($stateParams.pid);
  $scope.page = 0;
  $scope.total = 1;
  $scope.projectInfo = function(){
    $state.go('info');
  }

  $scope.getPage = function(){  //게시판 글 10개를 넘어가면 다음 10개를 서버에서 불러온다. ion-infinite-scroll를 이용해 무한 스크롤로 로딩.
    $scope.page++;

    $http({
      method: 'POST' ,
      url: HttpServ.url+'/getPage',
      data: {
        pid: PresentPid.get(),
        page: $scope.page
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function(result) {
      for(var i = 0; i<result.board.length; i++){
        Board.set(result.board[i].id, result.board[i].time, result.board[i].subject, result.board[i].content, result.board[i].name, result.board[i].hits, result.board[i].comments);
      };
      $scope.total = result.totalPages;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }).error(function(err){
      $scope.$broadcast('scroll.infiniteScrollComplete');
      console.log(err);
    });
  }

  $scope.board = Board.all(); //처음에 Board서비스에 저장된 게시들을 불러와 뷰에 나타낸다.

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
        
      })
      this.subject = ' ';
      this.content = ' ';
      $scope.hideModal();
    }
  }
)

.controller('BoardDetailCtrl', function($scope, $stateParams, $ionicHistory, $ionicNavBarDelegate, $http, Board, PresentPid, $cordovaFile, MyInfo, $timeout) {
  $timeout(function(){  //뷰에 증가된 조회수를 나타내기 위해 timeout서비스를 이용.
    Board.setHits($stateParams.boardId);
  },500);

  $ionicNavBarDelegate.showBackButton(true);
  $scope.board = Board.get($stateParams.pid);
  $scope.comments = $scope.board.comments;

  $http({
    method: 'POST' ,
    url: HttpServ.url+'/setHits',
    data: {
      pid: PresentPid.get(),
      title: $stateParams.boardId
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }).success(function(result) {

  })

  $scope.deleteDetail = function(){
    $http({
      method: 'POST' ,
      url: HttpServ.url+'/deleteDetail',
      data: {
        pid: PresentPid.get(),
        title: $stateParams.boardId,
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function(result) {
      if (result=='complete') {
        Board.removeBoard($stateParams.boardId);
        var start = parseInt($stateParams.boardId)+1;
        Board.change(start);
        $ionicHistory.goBack();
      }
    })
  }

  $scope.addComment = function(){
    $scope.comment = this.comment;
    $scope.comments.push({name:MyInfo.getMyName(), comment:$scope.comment});
    var boardId = $stateParams.boardId;

    $http({
      method: 'POST' ,
      url: HttpServ.url+'/setComments',
      data: {
        pid: PresentPid.get(),
        title: $stateParams.boardId,
        name: MyInfo.getMyName(),
        content: $scope.comment
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function(result) {

    })
    this.comment = ' ';
  }
});
