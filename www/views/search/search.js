angular.module('App')
.controller('SearchCtrl', function($scope, $stateParams, $http, $state, Projects, HttpServ, MyInfo) {
  $scope.searchRoom = function(){
    $scope.pid = this.pid;  //프로젝트 번호를 가져온다.
    if (Projects.get($scope.pid)) {
      alert('기존에 존재하는 프로젝트입니다.');
    }else {
      $http({
        method: 'POST' ,
        url: HttpServ.url+'/searchProject',
        data: {
          pid: $scope.pid,
          id: MyInfo.getMyId()
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).success(function(project) {
        if(project.being){
          Projects.add(project.pid, project.pname);
          $state.go('main');
        }
        else {
          alert('존재하지 않은 프로젝트입니다');
        }
      })
    }
  }
})
