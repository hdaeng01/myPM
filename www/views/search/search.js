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
          id: MyInfo.getMyId(),
          name: MyInfo.getMyName()
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).success(function(result) {
        if(result=="해당프로젝트없음") alert("해당프로젝트없음")
        else if(result=="가입요청"){
          alert("가입요청")
          $state.go("main");
        }
      })
    }
  }
})
