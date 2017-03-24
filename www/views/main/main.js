angular.module('App')
.controller('MainCtrl', function($scope, $stateParams, $ionicModal, $state, $ionicPush, $ionicNavBarDelegate, $ionicHistory, $http, Projects, PresentPid, MyInfo, Board, push, HttpServ, StorageService) {
  $scope.roomName='';
  $ionicNavBarDelegate.showBackButton(false);
  MyInfo.setId(StorageService.get());

  $ionicPush.register().then(function(t) {
    return $ionicPush.saveToken(t);
  }).then(function(t) {
    $http({
      method: 'POST' ,
      url: HttpServ.url+'/getMyInfo',
      data: {
        id: MyInfo.getMyId(),
        token: t.token
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function(info) {
      MyInfo.setName(info.name);
      for (var i = 0; i < info.projects.length; i++) {
        Projects.add(info.projects[i].pid, info.projects[i].pname);
      }
    })
    console.log('Token saved:'+ t.token);
  });

  $scope.showModal = function(){
    if ($scope.modal) {
      $scope.modal.show();
    } else {
      $ionicModal.fromTemplateUrl('views/main/modal-create.html',{
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

  $scope.$on('$destroy', function(){
    $scope.modal.remove();
  });

  $scope.createProject = function(){
    $scope.projectName = this.projectName;
    $http({
      method: 'POST' ,
      url: HttpServ.url+'/createRoom',
      data: {
        pname: $scope.projectName,
        captain_id: MyInfo.getMyId(),
        captain_name: MyInfo.getMyName()
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function(pid) {
      Projects.add(pid, $scope.projectName);
    });

    this.projectName = '';
    $scope.hideModal();
  };

  $scope.projects = Projects.all();

  $scope.remove = function(project) {
    $http({
      method: 'POST' ,
      url: HttpServ.url+'/removeRoom',
      data: {
        pid: project.pid,
        id: MyInfo.getMyId()
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function(result) {
        if (result=='방장') {
          alert('방장권한을 넘기신 후 삭제하세요.');
        } else {
          alert('삭제완료');
          Projects.remove(project);
        }
    });
  };

  $scope.goProject = function(pid){
    PresentPid.set(pid);
    Board.setEmpty();
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();

    $http({
      method: 'POST' ,
      url: HttpServ.url+'/getBoard',
      data: {
        pid: pid
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function(result) {
      var board = result;
      for (var i = 0; i < board.length; i++) {
        Board.set(board[i].id, board[i].time, board[i].subject, board[i].name, board[i].hits, board[i].comments);
      }
      $state.go('tabs.board',{pid:pid});
    });
  }
})
