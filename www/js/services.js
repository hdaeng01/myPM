angular.module('App.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [//{
  //   id: 0,
  //   name: 'Ben Sparrow',
  //   lastText: 'You on your way?',
  //   face: 'img/ben.png'
  // }, {
  //   id: 1,
  //   name: 'Max Lynx',
  //   lastText: 'Hey, it\'s me',
  //   face: 'img/max.png'
  // }, {
  //   id: 2,
  //   name: 'Adam Bradleyson',
  //   lastText: 'I should buy a boat',
  //   face: 'img/adam.jpg'
  // }, {
  //   id: 3,
  //   name: 'Perry Governor',
  //   lastText: 'Look at my mukluks!',
  //   face: 'img/perry.png'
  // }, {
  //   id: 4,
  //   name: 'Mike Harrington',
  //   lastText: 'This is wicked good ice cream.',
  //   face: 'img/mike.png'
  //}
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
        if (chats[i].id === parseInt(chatId)) {
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
  var myIoSocket = io.connect('http://192.168.1.100:8080');

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
  var boards = [{
      id: 0,
      name:'황정우',
      title: 'html 질문좀여',
      time: '17.01.26 15:40',
      hits: '3',
      content:'가나다라마바사....',
      comments:[{
        name : '송주용',
        content: '댓글 1'
      },
      {
        name : '임종묵',
        content: '댓글 2'
      },
      {
        name : '양석',
        content: '댓글 3'
      },
      {
        name : '김태완',
        content: '댓글 4'
      }]
    }, {
      id: 1,
      name:'송주용',
      title: 'nodejs 질문좀여',
      time: '17.01.25 13:10',
      hits: '6',
      content:'가나다라마바사....',
      comments:[{
        name : '황정우',
        content: '댓글 1'
      },
      {
        name : '임종묵',
        content: '댓글 2'
      },
      {
        name : '김태완',
        content: '댓글 3'
      },
      {
        name : '김상혁',
        content: '댓글 4'
      }]
    }, {
      id: 2,
      name:'류성진',
      title: 'express 질문좀여',
      time: '17.01.24 08:22',
      hits: '7',
      content:'가나다라마바사....',
      comments:[{
        name : '황정우',
        content: '댓글 1'
      },
      {
        name : '양석',
        content: '댓글 2'
      },
      {
        name : '송주용',
        content: '댓글 3'
      },
      {
        name : '김태완',
        content: '댓글 4'
      }]
    }, {
      id: 3,
      name:'임종묵',
      title: 'css 질문좀여',
      time: '17.01.22 11:12',
      hits: '8',
      content:'가나다라마바사....',
      comments:[{
        name : '황정우',
        content: '댓글 1'
      },
      {
        name : '김태완',
        content: '댓글 2'
      },
      {
        name : '성수현',
        content: '댓글 3'
      },
      {
        name : '김상혁',
        content: '댓글 4'
      }]
    }, {
      id: 4,
      name:'양석',
      title: 'javascript 질문좀여',
      time: '17.01.20 19:36',
      hits: '9',
      content:'가나다라마바사....',
      comments:[{
        name : '황정우',
        content: '댓글 1'
      },
      {
        name : '송주용',
        content: '댓글 2'
      },
      {
        name : '성수현',
        content: '댓글 3'
      },
      {
        name : '김상혁',
        content: '댓글 4'
      }]
    }
  ];

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
    }
    // add: function(name,id){
    //   boards.push({id:id, name:name, face:'img/'+name+'.png'});
    // }
  };
})
