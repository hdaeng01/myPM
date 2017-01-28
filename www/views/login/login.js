angular.module('App')
.controller('LoginCtrl', function($scope, $http, $stateParams, $ionicModal, $location, $state) {
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

  $scope.$on('$destroy', function(){
    $scope.modal.remove();
  });

  $scope.createAccount = function(){
    $scope.regiEmail = this.regiEmail;
    $scope.regiPass = this.regiPass;
    $scope.regiName = this.regiName;

    $http({
    method: 'POST' ,
    url: '/register/',
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
      }
    });

    $scope.hideModal();
  };

  $scope.doSubmit = function(){
    $scope.username = this.username;
    $scope.password = this.password;

    $http({
    method: 'POST' ,
    url: '/login/',
    data: {
      username: $scope.username,
      password: $scope.password
    },
    headers: {
      'Content-Type': 'application/json'
    }
    }).success(function(response) {
      if (response == 'welcome') {
        $state.go("main");
      } else if (response == '해당정보없음') {
        alert('해당정보 없음.');
      }
    });
  }

  $scope.logFacebook = function(){
    $http.get('/logFacebook/').success(
			function(data)
			{
        if (data == 'welcome') {
          alert('로그인 성공');
        } else if (data == '해당정보없음') {
          alert('해당정보 없음.');
        }
			}
    );
  }
})
