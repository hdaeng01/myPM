(function(){
  angular.module('App.controllers', []).controller('scheduleCtrl', ['$scope', '$ionicScrollDelegate', scheduleCtrl]);

  function scheduleCtrl($scope, $ionicScrollDelegate){
    var delegator = $ionicScrollDelegate.$getByHandle('scheduleScroll');
    $scope.config = {
      scrolling : true
    };
    $scope.$watch(function(){
      return $scope.config.scrolling;
    }, function(newval, oldval){
      if(newval != oldval){
        if(newval){
          delegator.getScrollView().options.scrollingY = true;
        }else{
          delegator.getScrollView().options.scrollingY = false;
        }
      }
    }, false);
  }
})();
