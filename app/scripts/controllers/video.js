'use strict';

/**
 * @ngdoc function
 * @name usbFileViewerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the usbFileViewerApp
 */
angular.module('usbFileViewerApp')
  .controller('VideoCtrl', ['$scope', '$rootScope','$http','$cookieStore','$log','$sce', function ($scope, $rootScope, $http, $cookieStore,$log,$sce) {


  	$scope.errorGettingFile = false;
  	$scope.error = {};

    $scope.getVideoFile = function(){
    	$log.log('Sending request for ' + $cookieStore.get('videoId'));
  		$http.jsonp($cookieStore.get('apiPath') + '/setupWebStream/' + $cookieStore.get('videoId') +
  					 '?callback=JSON_CALLBACK&userId=' + $cookieStore.get('userId') + '&groupId=' + $cookieStore.get('groupId')).
			  success(function(data) {
			  	var path = $cookieStore.get('httpPath') + '/' + data.filename;
			  	
			  	$scope.videoSource = $sce.trustAsHtml('<video controls>\n' +
			  												'<source src="' + path + '"\n' +
																'Your browser does not support the video element.\n' +
																'</video>');
			  	
			  	$log.log('Ready for streaming.');
			  }).
			  error(function(data,status) {
			    $log.log('Failed with status: ' + status + '\nData: ' + data);
			    $scope.errorGettingFile = true;
			    $scope.error = data;
			  });
    };

    $scope.getVideoFile();
  }]);