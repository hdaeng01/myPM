(function(){
  angular.module('App.services').service('projectServ', ['$q', projectServ]);

  function projectServ($q){
    this.getProjectInfo = getProjectInfo;

    /*
    해당 프로젝트에 관한 모든 정보
    {
      project_name : string,
      project_cdate : string, <-
        1)Date타입인 경우 dateServ.format(data, clientConfig.dateForm1);
        2)String인데 ""꼴인 경우 dateServ.formatDate(data, clientConfig.dateForm1);
      members : array
        each element structure : {
         type : , -> 직책?직급?
         name : , -> 회원 이름
         postCnt : -> 회원이 올린 게시물 수
        }
      files : array
        each element structure : {
          type : , -> file 종류(image, text, pdf, ...)자세한건 아래 예시 참고
          count : -> 해당 타입의 파일의 갯수
        }
    }
    */
    function getProjectInfo(){


      return $q(function(resolve, reject) {
        var data = {
          project_name : 'test1',
          project_cdate : '2017-02-05 13:23:04',
          members : [
            {type : 'Manager', name : '황정우', postCnt : 3},
            {type : 'Member', name : '송주용', postCnt : 2},
            {type : 'Member', name : '이재구', postCnt : 2},
            {type : 'Member', name : 'test1', postCnt : 1},
            {type : 'Member', name : 'test2', postCnt : 4},
            {type : 'Member', name : 'test3', postCnt : 3},
            {type : 'Member', name : 'test4', postCnt : 7}
          ],
          files : [
            {type : 'image', count : 3},
            {type : 'text', count : 2},
            {type : 'pdf', count : 4},
            {type : 'etc', count : 3},
            {type : 't1', count : 5},
            {type : 't2', count : 4},
            {type : 't3', count : 3},
            {type : 't4', count : 1}
          ]
        };
        return resolve(data);
      });;
    }
  }
})();
