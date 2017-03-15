// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('App.constants', []);
angular.module('App.directives', ['App.constants', 'App.services', 'ionic']);
angular.module('App.services', ['App.constants']);
angular.module('App.controllers', ['App.services', 'ionic']);
angular.module('App', ['ionic', 'btford.socket-io', 'ngCordova', 'ngCordovaOauth', 'ion-floating-menu', 'ionic.cloud', 'App.controllers', 'App.services', 'App.constants', 'App.directives'])

.run(function($ionicPlatform) {

  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
      cordova.plugins.backgroundMode.enable();
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicCloudProvider) {
  $ionicCloudProvider.init({
    "core": {
      "app_id": "4c9ab9c0"
    },
    "push": {
      "sender_id": "973163070527",
      "pluginConfig": {
        "ios": {
          "alert": true,
          "badge": true,
          "sound": true
        },
        "android": {
          "iconColor": "#343434"
        }
      }
    }
  })

  $stateProvider
    .state('tabs', {
      url: '/tabs',
      abstract: true,
      templateUrl: 'views/tabs/tabs.html',
      controller: 'TabCtrl'
    })
    .state('tabs.board', {
      cache: false,
      url: '/board/:chatId',
      views: {
        'tab-board': {
          templateUrl: 'views/board/board.html',
          controller: 'BoardCtrl'
        }
      }
    })
    .state('tabs.board-detail', {
      cache: false,
      url: '/board/board-detail/:boardId',
      views: {
        'tab-board': {
          templateUrl: 'views/board/board-detail.html',
          controller: 'BoardDetailCtrl'
        }
      }
    })
    .state('tabs.chats', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'views/chats/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tabs.schedule', {
      url: '/schedule/:chatId',
      views: {
        'tab-schedule': {
          templateUrl: 'views/schedule/tab-schedule.html'
        }
      }
    })
    .state('main', {
      url: '/main',
      templateUrl: 'views/main/main.html',
      controller: 'MainCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/login/login.html',
      controller: 'LoginCtrl'
    })
    .state('search', {
      url: '/search',
      templateUrl: 'views/search/search.html',
      controller: 'SearchCtrl'
    })

  $urlRouterProvider.otherwise('/login');
})
