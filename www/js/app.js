// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('App', ['ionic','btford.socket-io'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tabs', {
      url: '/tabs',
      templateUrl: 'views/tabs/tabs.html'
    })
    .state('tabs.board', {
      url: '/board',
      views: {
        'board-tab': {
          templateUrl: 'views/board/board.html'
        }
      }
    })
    .state('tabs.chat', {
      url: '/chat',
      views: {
        'chat-tab': {
          templateUrl: 'views/chat/chat.html',
          controller: 'ChatController'
        }
      }
    })
  $urlRouterProvider.otherwise('/tabs');
})

.factory('mySocket', function (socketFactory) {
  var myIoSocket = io.connect('http://192.168.1.100:8080');

  mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
})

.directive('focusMe', function($timeout) {
  return {
    link: function(scope, element, attrs) {

      $timeout(function() {
        element[0].focus();
      });
    }
  };
});
// .factory('focus', function($timeout, $window) {
//     return function(id) {
//       // timeout makes sure that it is invoked after any other event has been triggered.
//       // e.g. click events that need to run before the focus or
//       // inputs elements that are in a disabled state but are enabled when those events
//       // are triggered.
//       $timeout(function() {
//         var element = $window.document.getElementById(id);
//         if(element)
//           element.focus();
//       });
//     };
//   })
