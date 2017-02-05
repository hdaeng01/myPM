angular.module('App')
.controller('LoginCtrl', function($scope, $http, $stateParams, $ionicModal, $location, $state, $cordovaFile, getMyInfo, $cordovaOauth) {
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
    url: 'http://192.168.1.101:8080/auth/register/',
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
    url: 'http://192.168.1.101:8080/auth/login/',
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
        // getMyInfo.insertName(response);
        // getMyInfo.insertEmail($scope.username);
        var data = {
          route : 'local',
          id : $scope.username,
          username : response
        };
        
        $cordovaFile.writeFile(cordova.file.dataDirectory, "myInfo.json", JSON.stringify(data), true)
          .then(function (success) {
            // success
            alert("myInfo.json 생성성공 "+data.route+' '+data.id+' '+data.username);
            $state.go("main");
          }, function (error) {
            // error
          });
      }
    });
  }

  $scope.logFacebook = function() {
    $cordovaOauth.facebook("1165650960200214", ["email", "user_relationships"])
      .then(function(result) {
        // results
        $http.get("https://graph.facebook.com/v2.2/me",
        {
          params:
          {
            access_token: result.access_token,
            fields: "id,name,gender,location,website,picture,relationship_status,email",
            format: "json"
          }
        })
        .then(function(res) {
	                $scope.profileData = res.data;
                  var data = {
                    route : 'facebook',
                    id : $scope.profileData.email,
                    username : $scope.profileData.name
                  }
                  $cordovaFile.writeFile(cordova.file.dataDirectory, "myInfo.json", JSON.stringify(data), true)
                    .then(function (success) {
                      // success
                      $state.go("main");
                    }, function (error) {
                      // error
                    });
	            }, function(error) {
	                alert("There was a problem getting your profile.  Check the logs for details.");
	                console.log(error);
	            });
      }, function(error) {
        // error
      });
  }


  $scope.logGoogle = function(){
    $cordovaOauth.google("1074251742453-48vvrjk8u4jfegfkl2gsfnird3ofrvj4.apps.googleusercontent.com", ["email"]).then(function(result) {
        console.log("Response Object -> " + JSON.stringify(result));
    }, function(error) {
        console.log("Error -> " + error);
    });
  }
})
