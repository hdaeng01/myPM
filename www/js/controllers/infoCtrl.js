(function(){
  angular.module('App.controllers').controller('infoCtrl', ['$scope', 'projectServ', infoCtrl]);

  function infoCtrl($scope, projectServ){
    $scope.config = {
      colors : ['#ff6666', '#ff944d', '#ffff80', '#99ff99', '#80b3ff', '#9a9ae5', '#cccccc']
    };
    $scope.data = {};
    $scope.functions = {
      initialize : function(){
        $scope.data = {
          project : {}
        };
      },
      setProject : function(project){
        $scope.functions.initialize();
        var data = $scope.data;
        data.project = project;
        data.project.meta = {
          total_file : 0,
          total_member : data.project.members.length,
          total_post : 0
        };
        data.project.files = data.project.files.map(function(value, index){
          var t = value.type;
          delete value.type;
          value.color = $scope.config.colors[index % $scope.config.colors.length];
          value.text = t;
          data.project.meta.total_file += value.count;
          return value;
        });
        data.project.files = data.project.files.map(function(value, index){
          value.percentage = parseInt((value.count / data.project.meta.total_file) * 100);
          return value;
        });
        for(var i = 0;i < data.project.members.length;i++){
          data.project.meta.total_post += data.project.members[i].postCnt;
        }
        console.log($scope.data);
      }
    };
    projectServ.getProjectInfo().then(function(succ){
      $scope.functions.setProject(succ);
    }).catch(function(err){
      alert('failed in reading project information');
    });
  }
})();
