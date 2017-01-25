// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('App', ['ionic', 'App.services', 'btford.socket-io'])

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
      abstract: true,
      templateUrl: 'views/tabs/tabs.html'
    })
    .state('tabs.board', {
      url: '/board/chatId',
      views: {
        'tab-board': {
          templateUrl: 'views/board/board.html',
          controller: 'BoardCtrl'
        }
      }
    })
    .state('tabs.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'views/chats/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tabs.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'views/chats/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })
    .state('main', {
      url: '/main',
      templateUrl: 'views/main/main.html',
      controller: 'MainCtrl'
    })
  $urlRouterProvider.otherwise('/main');
})