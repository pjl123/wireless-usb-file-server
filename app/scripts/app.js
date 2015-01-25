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
      .when('/', {
        templateUrl: 'views/main.html',
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
      .otherwise({
        redirectTo: '/'
      });
  });
