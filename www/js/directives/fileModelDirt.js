(function(){
  angular.module('App.directives').directive('fileModel', ['$parse', fileModelDirt]);

  function fileModelDirt($parse){
    return {
      scope : false,
      restrict : 'A',
      link : function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                  modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
  }
})();
