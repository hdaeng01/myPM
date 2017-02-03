angular.module('App.services', [])

.factory('Chats', function() {
  var chats = [//{
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
    add: function(name,id){
      chats.push({id:id, name:name, face:'img/'+name+'.png'});
    }
  };
})

.factory('mySocket', function (socketFactory) {
  var myIoSocket = io.connect('http://192.168.0.4:8080');

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
        if (boards[i].id === parseInt(boardId)) {
          return boards[i];
        }
      }
      return null;
    },
    set: function(name, title, content){
      boards.unshift({id:boards.length-1, name:name, title:title, content:content, time:new Date(), hits:0, comments:[]});
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

// .factory('getBoard',function($http){
//   return {
//     get:function(pid){
//       return $http.get('http://192.168.0.4:8080/getBoard'+'?pid='+pid)
//     }
//   }
// })
