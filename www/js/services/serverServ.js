(function(){
  angular.module('App.services').service('serverServ', ['serverConfig', serverServ]);

  function serverServ(serverConfig){
    this.fullpath = serverConfig.protocol + '://' + serverConfig.ip + ':' + serverConfig.port;
  }
})();
