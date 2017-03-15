(function(){
  angular.module('App.controllers').controller('colorRadioCtrl', ['$scope', ctrl]);

  function ctrl($scope){
    $scope.data = {};
    $scope.select = select;
    $scope.data.colorList = [];
    $scope.data.colorWidth = 0;

    function select(index){
      $scope.data.selectedIndex = index;
      $scope.$emit('updateSelected', {
        selected : $scope.data.colorList[$scope.data.selectedIndex]
      });
    }

    $scope.$on('setColorList', function(event, args){
      $scope.data.colorList = args.colorList;
      $scope.data.colorWidth = parseInt(100 / args.colorList.length);
    });
    $scope.$on('setSelectedIndex', function(event, args){
      $scope.data.selectedIndex = args.index;
    });
  }
})();
