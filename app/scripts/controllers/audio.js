'use strict';

/**
 * @ngdoc function
 * @name usbFileViewerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the usbFileViewerApp
 */
angular.module('usbFileViewerApp')
  .controller('AudioCtrl', ['$scope','$http','$cookieStore','$log','$sce', function ($scope, $http, $cookieStore,$log,$sce) {
  	var serverPath = 'C:/Users/Patrick.pat-PC/Documents/School/Senior Design/wireless-usb-file-server/temp_files';

    $scope.audioSource = 'test';

    $scope.getAudioFile = function(){
    	$log.log('Sending request for ' + $cookieStore.get('audioPath'));
  		$http.jsonp('http://localhost:3000/setupWebStream?callback=JSON_CALLBACK&accessToken=foo&path=' + $cookieStore.get('audioPath')).
			  success(function(data) {
			  	var path = serverPath + '/' + data.filename;
			  	/*
			  	$scope.audioSource = '<audio controls>\n' +
			  													'<source src="' + path + '" type="audio/mpeg">\n' +
																'Your browser does not support the audio element.\n' +
																'</audio>';*/

					$scope.audioSource = $sce.trustAsResourceUrl(path);
			  	
			  	$log.log('Ready for streaming.');
			  }).
			  error(function(status,data) {
			    $log.log('Failed with status: ' + status + '\nData: ' + data);
			  });
    };
  }]);