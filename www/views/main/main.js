angular.module('App')
.controller('MainCtrl', function($scope, $stateParams, $ionicModal, Chats, $state, getRoomId, $ionicNavBarDelegate, $http, getMyInfo, $cordovaFile) {
  $scope.roomName='';
  $ionicNavBarDelegate.showBackButton(false);

  $cordovaFile.createFile(cordova.file.dataDirectory, "pids", false)
    .then(function (success) {
      // success

    }, function (error) {
      // error

    });

  $cordovaFile.readAsText(cordova.file.dataDirectory, "pids")
    .then(function (success) {
      // success

      if (success) {
        var projects = success.split('/');
        
        for (var i = 0; i < projects.length-2; i+=2) {
          Chats.add(projects[i+1],projects[i]);
        }
      }
    }, function (error) {
      // error

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

  $scope.createRoom = function(){
    $scope.roomName = this.roomName;

    $http.get('http://192.168.0.4:8080/createRoom'+'?pname='+$scope.roomName+'&captain_id='+getMyInfo.get()).success(function(pid) {
      Chats.add($scope.roomName,pid);
      $cordovaFile.writeExistingFile(cordova.file.dataDirectory, "pids", pid+'/'+$scope.roomName+'/')
        .then(function (success) {
          // success

        }, function (error) {
          // error

        });

      $cordovaFile.writeFile(cordova.file.dataDirectory, pid+".txt", $scope.roomName+'\n', false)
        .then(function (success) {
          // success

        }, function (error) {
          // error
        });
    });
    this.roomName = '';
    $scope.hideModal();
  };

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };

  $scope.goRoom = function(roomId){
    getRoomId.add(roomId);
    $state.go('tabs.board',{chatId:roomId});
  }
})
