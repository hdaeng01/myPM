angular.module('App.services', [])

.factory('Chats', function() {  //프로젝트들을 채팅방개념으로 인식.
  var chats = [//{  //프로젝트들의 모임
  //   id: 0,
  //   name: 'Ben Sparrow',
  //   lastText: 'You on your way?',
  //   face: 'img/ben.png'
  // }
  ];
  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === chatId) {
          return chats[i];
        }
      }
      return null;
    },
    add: function(name,id,length){
      chats.push({id:id, name:name, face:'img/'+name+'.png', boardLength:length});
    },
    setBoardLength: function(chatId){ //하나의 프로젝트에 있는 게시판의 개수를 올린다.
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id == chatId) {
          var tmp = parseInt(chats[i].boardLength);
          tmp++;
          chats[i].boardLength = tmp.toString();
          return null;
        }
      }
    },
    getBoardLength: function(chatId){ //게시판의 개수를 얻는다.
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id == chatId) {
          return chats[i].boardLength ;
        }
      }
    }
  };
})

.factory('mySocket', function (socketFactory) {
  var myIoSocket = io.connect('http://192.168.1.101:8080');

  mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
})

.factory('getRoomId', function() {
  var roomId = ' ';

  return {
      add : function(room_id){
        roomId = room_id;
      },
      get : function(){
        return roomId;
      }
  };
})

.factory('Boards', function() {
  var boards = [];

  return {
    all: function() {
      return boards;
    },
    remove: function(chat) {
      boards.splice(boards.indexOf(chat), 1);
    },
    get: function(boardId) {
      for (var i = 0; i < boards.length; i++) {
        if (boards[i].id == parseInt(boardId)) {
          return boards[i];
        }
      }
      return null;
    },
    getLength: function(){
      return boards.length;
    },
    set: function(id, time, title, content, name, hits, comments){
      boards.push({id:id, name:name, title:title, content:content, time:time, hits:hits, comments:comments});
    },
    unshift: function(id, time, title, content, name, hits, comments){
      boards.unshift({id:id, name:name, title:title, content:content, time:time, hits:hits, comments:comments});
    },
    setEmpty: function(){
      boards = [];
      console.log('게시판 지움');
    },
    removeBoard: function(boardId) {
      for (var i = 0; i < boards.length; i++) {
        if (boards[i].id == parseInt(boardId)) {
          boards.splice(boards.indexOf(boards[i]), 1);
          break;
        }
      }
    },
    setHits: function(id){
      for (var i = 0; i < boards.length; i++) {
        if (boards[i].id == id) {
          var tmp = parseInt(boards[i].hits);
          tmp = (++tmp).toString();
          boards[i].hits = tmp;
          break;
        }
      }
    },
    change: function(id){
      for (var i = boards.length-1; i > -1; i--) {
        if (boards[i].id==id) {
            var tmp = parseInt(boards[i].id)-1;
            boards[i].id = tmp;
            id++;
        }
      }
    }
  };
})

.factory('getMyInfo', function() {
  var name;
  var email;

  return {
    insertName: function(displayName){
      name=displayName;
    },
    insertEmail: function(uname){
      email=uname;
    },
    get: function(){
      return name;
    },
    getEmail: function(){
      return email;
    }
  }
})

.factory('checkLogin', function(){
  var login=false;
  return {
    set: function(){
      login=true;
    },
    get: function(){
      return login;
    }
  }
})

.factory('push', function(){
  var push;

  return{
    set: function(p){
      push = p;
    },
    get: function(){
      return push;
    }
  }
})
