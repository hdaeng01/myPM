angular.module('App')
.controller('LoginCtrl', function($scope, $http, $stateParams, $ionicModal, $state, $ionicPush, StorageService, HttpServ, MyInfo) {
  StorageService.removeAll();
  if (StorageService.get()!=null) {
    $state.go("main");
  }

  $ionicPush.register().then(function(t) {
    return $ionicPush.saveToken(t);
  }).then(function(t) {
    MyInfo.setToken(t.token);
    console.log('Token saved:'+ t.token);
  });

  $scope.showModal = function(){
    if ($scope.modal) {
      $scope.modal.show();
    } else {
      $ionicModal.fromTemplateUrl('views/login/modal-register.html',{
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

  // $scope.$on('$destroy', function(){
  //   $scope.modal.remove();
  // });

  $scope.createAccount = function(){
    $scope.regiEmail = this.regiEmail;
    $scope.regiPass = this.regiPass;
    $scope.regiName = this.regiName;

    $http({
    method: 'POST' ,
    url: HttpServ.url+'/auth/register/',
    data: {
        email: $scope.regiEmail,
        password: $scope.regiPass,
        displayname: $scope.regiName
    },
    headers: {
        'Content-Type': 'application/json'
    }
    }).success(function(response) {
      if (response == 'welcome') {
        console.log('Success');
      } else if (response == 'notFullfill') {
        alert('모두 기입해주세요.');
      } else if(response == '이미 등록되어 있는 정보입니다.!!'){
        alert('이미 등록되어 있는 정보입니다.!!');
      }
    });

    $scope.hideModal();
  };

  $scope.doSubmit = function(){
    $scope.username = this.username;
    $scope.password = this.password;

    $http({
    method: 'POST' ,
    url: '/login',
    data: {
      username: $scope.username,
      password: $scope.password
    },
    headers: {
      'Content-Type': 'application/json'
    }
    }).success(function(response) {
      if (response == '해당정보없음') {
        alert('해당정보 없음.');
      } else {
        StorageService.set($scope.username);
        $state.go("main");
      }
    });
  }
})
