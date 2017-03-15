(function(){
  angular.module('App.directives').directive('bar', bar);

  function bar(){
    return {
      require : '^infoCtrl',
      restrict : 'E',
      scope : {},
      controller : ['$scope', barCtrl],
      templateUrl : 'views/schedule/bar.html'
    };
  }

  function barCtrl($scope){
    $scope.data = [];
    $scope.$on('setData', function(event, args){
      console.log('listen');
      $scope.tot = args.tot;
      $scope.data = args.data.map(function(value, index){
        value.percentage = parseInt((value.count / args.tot) * 100);
      });
    });
  }
})();
