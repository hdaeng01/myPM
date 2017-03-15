(function(){
  angular.module('App.directives').directive('calendar', [calendar]);

  function calendar(){
    return {
      restrict : 'AE',
      templateUrl : 'views/schedule/calendar.html',
      controller : ['$scope', 'dateServ', calCtrl],
      link : calLink
    }
  }

  function calCtrl($scope, dateServ){
    const mode_texts = ['Read Mode', 'Write Mode'];

    $scope.date = {};
    $scope.config = {};
    $scope.setDate = setDate;
    $scope.changeMode = changeMode;

    //initialize
    $scope.config.mode = 'read';
    $scope.mode_text = mode_texts[0];
    $scope.config.dayNames = dateServ.dayNames('e-s');

    //function implements
    function setDate(year, month){
      $scope.date.year = year;
      $scope.date.month = month;
      $scope.$broadcast('update-date', $scope.date);
    }
    function changeMode(){
      if($scope.config.mode == 'read'){
        $scope.config.mode = 'write';
        $scope.mode_text = mode_texts[1];
      }else{
        $scope.config.mode = 'read';
        $scope.mode_text = mode_texts[0];
      }
      $scope.$broadcast('mode-change', {mode : $scope.config.mode});
    }

    $scope.$on('header-prev-click', function(event, args){
      if($scope.date.year == 1970 && $scope.date.month == 1){
        return;
      }
      if($scope.date.month == 1){
        setDate($scope.date.year-1, 12);
        return;
      }
      setDate($scope.date.year, $scope.date.month-1);
    });
    $scope.$on('header-next-click', function(event, args){
      if($scope.date.month == 12){
        setDate($scope.date.year+1, 1);
        return;
      }
      setDate($scope.date.year, $scope.date.month+1);
    });
  }

  function calLink($scope, elem, attrs, ctrl){
    //initialize
    var curdate = new Date();
    var calendar_body = angular.element(elem[0].querySelector('div#calendar-body'));
    $scope.setDate(curdate.getFullYear(), curdate.getMonth()+1);
    $scope.$broadcast('mode-change', {mode : $scope.config.mode});

    function touchStart(e){
      e.preventDefault();
    }
    calendar_body.bind('touchstart', touchStart);
    $scope.$on('$destroy', function(){
      calendar_body.unbind('touchstart', touchStart);
    });
  }
})();
