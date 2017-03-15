(function(){
  angular.module('App.controllers').controller('calendarHeaderCtrl', ['$scope', calendarHeaderCtrl]);

  function calendarHeaderCtrl($scope){
    $scope.prev = prev;
    $scope.next = next;

    function prev(){
      $scope.$emit('header-prev-click');
    }
    function next(){
      $scope.$emit('header-next-click');
    }
  }
})();
