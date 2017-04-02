angular.module('App')
.controller('RequestCtrl', function($scope, $stateParams, $http, $state, Projects, HttpServ, MyInfo) {
  $scope.teammates = [];
  var _request;
  var _pid;
  var _id;

  $http({
    method: 'POST' ,
    url: HttpServ.url+'/getRequest',
    data: {
      id: MyInfo.getMyId()
    },
    headers: {
      'Content-Type': 'application/json'
    }
  }).success(function(results) {
    console.log(results);
    if (results.length>0) {
      for (var i in results) {
        $scope.teammates.push(results[i]);
      }
    }
  })

  $scope.approval=function(teammate){
    _request='Y';
    _pid = teammate.pid;
    _id = teammate.id;
    setRequest(teammate);
  }
  $scope.denial=function(teammate){
    _request='N';
    _pid = teammate.pid;
    _id = teammate.id;
    setRequest(teammate);
  }
  function setRequest(teammate){
    $http({
      method: 'POST' ,
      url: HttpServ.url+'/setRequest',
      data: {
        request: _request,
        pid: _pid,
        id: _id
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }).success(function(results) {
      $scope.teammates.splice($scope.teammates.indexOf(teammate), 1);
    })
  }
});
