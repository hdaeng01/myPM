angular.module('App')
.controller('MainCtrl', function($scope, $stateParams, $ionicModal, Chats, getRoomId, $ionicNavBarDelegate, $http, getMyInfo) {
  $scope.roomName='';
  $ionicNavBarDelegate.showBackButton(false);

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

    $http.get('/createRoom'+'?pname='+$scope.roomName+'&captain_id='+getMyInfo.get()).success(function(pid) {
      console.log(pid);
      Chats.add($scope.roomName,pid);
      getRoomId.add(pid);
    });

    $scope.hideModal();
  };

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})
