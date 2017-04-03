angular.module('App')
.controller('MainCtrl', function($scope, $stateParams, $ionicModal, $state, $ionicPush, $ionicNavBarDelegate, $ionicHistory, $http, $ionicLoading, $rootScope, Projects, PresentPid, MyInfo, Board, push, HttpServ, StorageService) {
  $scope.roomName='';
  $ionicNavBarDelegate.showBackButton(false);
  MyInfo.setId(StorageService.get());

  $rootScope.$on('cloud:push:notification', function(event, data) {
    var msg = data.message;
    var str = msg.text.split(' ');
    if(str[3]=='게시물이'){
      var pid = str[0].substring(str[0].length-9,str[0].length-1);
      PresentPid.set(pid);
      Board.setEmpty();
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
    } else if(str[2]=='가입을'){
      var start = str[0].indexOf('(');
      var end = str[0].indexOf(')');
      var pname = str[0].slice(0, start);
      var pid = str[0].slice(start+1, end);
      $rootScope.$apply(function(){
        Projects.add(pid, pname);
      });

      $state.go('main');
    } else{
      var pid = str[0].substring(str[0].length-9,str[0].length-1);
      PresentPid.set(pid);
      $state.go('tabs.chats',{pid:pid});
    }
    push.set(msg);
    var tmp = push.get();
  });

  $ionicLoading.show();
  $http({
    method: 'POST' ,
    url: HttpServ.url+'/getMyInfo',
    data: {
      id: MyInfo.getMyId()
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }).success(function(info) {
    MyInfo.setName(info.name);
    console.log(info);
    for (var i = 0; i < info.projects.length; i++) {
      Projects.add(info.projects[i].pid, info.projects[i].pname);
    }
    $ionicLoading.hide();
  }).error(function(err){
    $ionicLoading.show({
      template: 'Could not load project. Please try again later.',
      duration: 3000
    });
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
      url: HttpServ.url+'/createProject',
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

    $ionicLoading.show();
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
      $ionicLoading.hide();
      $state.go('tabs.board',{pid:pid});
    }).error(function(err){
      $ionicLoading.show({
        template: 'Could not load project. Please try again later.',
        duration: 3000
      });
    });
  }
})
