(function(){
  angular.module('App.services').service('authServ', [authServ]);

  function authServ(){
    this.id = 't1';
    /*
    로그인한 회원의 정보
    {
      id, ...형이 회원 관리하는데 사용한 모든 정보(이름, 성별, 이메일...)
    }
    */
  }
})();
