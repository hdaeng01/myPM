angular.module('App')
.controller('LoginCtrl', function($scope, $http, $stateParams, $ionicModal, $location, $state, $cordovaFile, getMyInfo, $cordovaOauth, $ionicPush, push) {
  var token;
  $ionicPush.register().then(function(t) {  //처음 앱이 시작되면 해당 핸드폰을 구별하는 token이 생성된다.
    return $ionicPush.saveToken(t);
  }).then(function(t) {
    token = t.token;
    console.log('Token saved:'+ t.token);
  });

  $scope.showModal = function(){  // 회원가입을 할 때는 modal창을 띄워 진행.
    if ($scope.modal) {
      $scope.modal.show();
    } else {
      $ionicModal.fromTemplateUrl('views/login/modal-register.html',{ //modal view의 위치.
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
    url: 'http://192.168.1.101:8080/auth/register/', //회원가입시 적은 내용을 서버에 보낸다.
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
    url: 'http://192.168.1.101:8080/auth/login/', //로그인시 정보를 서버에 보내 확인.
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
      } else {  //로그인이 정보를 확인했으면 자신의 핸드폰에 아이디 가입경로, 아이디, 이름, 토큰을 파일로 저장한다.
        var data = {
          route : 'local',
          id : $scope.username,
          username : response,
          token : token
        };

        $cordovaFile.writeFile(cordova.file.dataDirectory, "myInfo.json", JSON.stringify(data), true)
          .then(function (success) {
            // success
            $state.go("main");  //저장 후 main 페이지로 이동
          }, function (error) {
            // error
          });
      }
    });
  }

  $scope.logFacebook = function() { //페이스북 auth로그인. $cordovaOauth서비스 이용
    $cordovaOauth.facebook("1165650960200214", ["email", "user_relationships"]) //페이스북 개발자 앱에 등록된 앱 아이디.
      .then(function(result) {
        // results
        $http.get("https://graph.facebook.com/v2.2/me",
        {
          params:
          {
            access_token: result.access_token,
            fields: "id,name,gender,location,website,picture,relationship_status,email",  //이런한 것들을 페이스북에 요청.
            format: "json"
          }
        })
        .then(function(res) {
	                $scope.profileData = res.data; //요청받은 것을 저장.
                  var data = {
                    route : 'facebook',
                    id : $scope.profileData.email,
                    username : $scope.profileData.name,
                    picture : $scope.profileData.picture,
                    token: token
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
