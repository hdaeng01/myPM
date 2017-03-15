(function(){
  angular.module('App.controllers').controller('fileCtrl', ['$scope', 'fileServ', 'serverServ', 'authServ', fileCtrl]);

  function fileCtrl($scope, fileServ, serverServ, authServ){
    $scope.files = [];

    $scope.readList = readList;
    $scope.upload = upload;
    $scope.delete = del;
    $scope.downloadUrl = downloadUrl;

    readList();

    function readList(){
      fileServ.readList(serverServ.fullpath, authServ.id).then(function(succ){
        $scope.files = succ;
      }).catch(function(err){
        console.error(err);
      });
    }

    function upload(){
      var file = $scope.uploadFile;
      fileServ.upload(serverServ.fullpath, file , authServ.id).then(function(succ){
        readList();
      }).catch(function(err){
        console.error(err);
      });
    }

    function del(fid){
      console.log('delete fid : ' + fid);
      fileServ.delete(serverServ.fullpath, fid, authServ.id).then(function(succ){
        readList();
      }).catch(function(err){
        alert('delete file failed');
      });
    }

    function downloadUrl(fid){
      return serverServ.fullpath + '/users/' + authServ.id + '/files/' + fid;
    }
  }
})();
