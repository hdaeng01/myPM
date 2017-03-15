(function(){
  angular.module('App.services').service('fileServ', ['$http', '$q', fileServ]);

  function fileServ($http, $q){
    this.readList = readList;
    this.upload = upload;
    this.delete = del;

    function readList(url, owner){
      return $q(function(resolve, reject){
        if(!owner){
          return reject(400);
        }
        $http({
          url : url + '/users/' + owner + '/files',
          method : 'GET'
        }).then(function(succ){
          console.log(succ);
          return resolve(succ.data);
        }).catch(function(err){
          console.log(err);
          return reject(err.status);
        });
      });
    }
    /*
    input form
      url : d1 not null,
      owner : d2 not null
    */

    function upload(url, file, owner){
      return $q(function(resolve, reject){
        if(!file || !owner){
          return reject(400);
        }
        var fd = new FormData();
        fd.append('file', file);
        $http({
          url : url + '/users/' + owner + '/files/' + file.name,
          method : 'POST',
          data : fd,
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        }).then(function(succ){
          return resolve(succ.status);
        }).catch(function(err){
          return reject(err.status);
        });
      });
    }
    /*
    input form
      url : d1 not null
      file object : d2 not null,
      owner d3 not null
    */

    function del(url, fid, owner){
      return $q(function(resolve, reject){
        if(!url || !fid || !owner){
          return reject(400);
        }
        $http({
          url : url + '/users/' + owner + '/files/' + fid,
          method : 'POST',
          data : {
            _method : 'DELETE'
          }
        }).then(function(succ){
          return resolve(succ.data);
        }).catch(function(err){
          return reject(err.status);
        });
      });
    }
    /*
    input form
      url : d1 not null,
      fid : d2 not null,
      owner : d3 not null,
    */
  }
})();
