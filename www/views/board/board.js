angular.module('App')
.controller('BoardCtrl', function($scope, $state, $stateParams, $ionicModal, $http, Chats, Boards, $ionicNavBarDelegate, getRoomId, getMyInfo, $cordovaFile) {
  $scope.chatRoom = Chats.get($stateParams.chatId);
  $scope.board = Boards.get($stateParams.boardId);
  $scope.page = 0;
  $scope.total = 1;

  $scope.projectInfo = function(){
    console.log("aaaaaaaaaaaaaa");
    $state.go('info');
  }

  $scope.getPage = function(){  //게시판 글 10개를 넘어가면 다음 10개를 서버에서 불러온다. ion-infinite-scroll를 이용해 무한 스크롤로 로딩.
    $scope.page++;

    $http({
      method: 'POST' ,
      url: 'http://192.168.0.4:8080/getPage',
      data: {
        pid: getRoomId.get(),
        page: $scope.page
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function(result) {
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

  $scope.boards = Boards.all(); //처음에 Boards서비스에 저장된 게시들을 불러와 뷰에 나타낸다.
  getRoomId.add($stateParams.chatId);

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
    var time = new Date();
    var subject = this.subject;
    var content = this.content;

    Chats.setBoardLength($stateParams.chatId);
    var file = $scope.uploadFile;

    $cordovaFile.readAsText(cordova.file.dataDirectory, "myInfo.json")
      .then(function (success) {
        // success
        var tmp = JSON.parse(success);
        var token = tmp.token;

        $http({
          method: 'POST' ,
          url: 'http://192.168.0.4:8080/addBoard',
          data: {
            pid: getRoomId.get(),
            subject: subject,
            content: content,
            time: time,
            name: getMyInfo.get(),
            token: token
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }).success(function(result) {
          Boards.unshift(result, time, subject, content, getMyInfo.get(), 0, []);
          $scope.boards = Boards.all();
          $scope.hideModal();
        })
      })
    }
  }
)

.controller('BoardDetailCtrl', function($scope, $stateParams, $ionicHistory, $ionicNavBarDelegate, $http, Boards, getRoomId, $cordovaFile, getMyInfo, $timeout) {
  $timeout(function(){  //뷰에 증가된 조회수를 나타내기 위해 timeout서비스를 이용.
    Boards.setHits($stateParams.boardId);
  },500);

  $ionicNavBarDelegate.showBackButton(true);
  $scope.board = Boards.get($stateParams.boardId);
  $scope.comments = $scope.board.comments;

  $http({
    method: 'POST' ,
    url: 'http://192.168.0.4:8080/setHits',
    data: {
      pid: getRoomId.get(),
      title: $stateParams.boardId
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }).success(function(result) {

  })

  $scope.deleteDetail = function(){
    $cordovaFile.readAsText(cordova.file.dataDirectory, "myInfo.json")
      .then(function (success) {
        // success
        var tmp = JSON.parse(success);
        var token = tmp.token;

        $http({
          method: 'POST' ,
          url: 'http://192.168.0.4:8080/deleteDetail',
          data: {
            pid: getRoomId.get(),
            title: $stateParams.boardId,
            token: token
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }).success(function(result) {
          if (result=='complete') {
            Boards.removeBoard($stateParams.boardId);
            var start = parseInt($stateParams.boardId)+1;
            Boards.change(start);
            $ionicHistory.goBack();
          }
        })
    })
  }

  $scope.addComment = function(){
    $scope.comment = this.comment;
    $scope.comments.push({name:getMyInfo.get(), comment:$scope.comment});
    var boardId = $stateParams.boardId;

    $http({
      method: 'POST' ,
      url: 'http://192.168.0.4:8080/setComments',
      data: {
        pid: getRoomId.get(),
        title: $stateParams.boardId,
        name: getMyInfo.get(),
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
