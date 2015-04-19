'use strict';

/**
 * @ngdoc overview
 * @name usbFileViewerApp
 * @description
 * # usbFileViewerApp
 *
 * Main module of the application.
 */
angular
  .module('usbFileViewerApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/main/:userId?', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/mobile/main/:userId?',{
        templateUrl: 'views/mobile/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/audio', {
        templateUrl: 'views/audio_player.html',
        controller: 'AudioCtrl'
      })
      .when('/mobile/audio', {
        templateUrl: 'views/mobile/audio_player.html',
        controller: 'AudioCtrl'
      })
      .when('/video', {
        templateUrl: 'views/video_player.html',
        controller: 'VideoCtrl'
      })
      .when('/mobile/video', {
        templateUrl: 'views/mobile/video_player.html',
        controller: 'VideoCtrl'
      })
      .otherwise({
        redirectTo: '/main'
      });
  });
