'use strict';

/**
 * @ngdoc function
 * @name usbFileViewerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the usbFileViewerApp
 */
angular.module('usbFileViewerApp')
  .controller('AudioCtrl', ['$scope', '$rootScope','$http','$cookieStore','$log','$sce', function ($scope, $rootScope, $http, $cookieStore,$log,$sce) {

  	$scope.errorGettingFile = false;
  	$scope.error = {};

    $scope.getAudioFile = function(){
    	$log.log('Sending request for ' + $cookieStore.get('audioId'));
  		$http.jsonp($cookieStore.get('apiPath') + '/setupWebStream/' + $cookieStore.get('audioId') +
  					 '?callback=JSON_CALLBACK&userId=' + $cookieStore.get('userId') + '&groupId=' + $cookieStore.get('groupId')).
			  success(function(data) {
			  	var path = $cookieStore.get('httpPath') + '/' + data.filename;
			  	
			  	$scope.audioSource = $sce.trustAsHtml('<audio src="' + path + '" controls>\n' +
																'Your browser does not support the audio element.\n' +
																'</audio>');
			  	
			  	$log.log('Ready for streaming.');
			  	$scope.fileSetUp = true;
			  }).
			  error(function(data, status) {
			    $log.log('Failed with status: ' + status + '\nData: ' + data);
			   	$scope.errorGettingFile = true;
			    $scope.error = data;
			  });
    };

    $scope.getAudioFile();
  }]);