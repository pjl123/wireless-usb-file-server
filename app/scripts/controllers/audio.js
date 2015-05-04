'use strict';

/**
 * @ngdoc function
 * @name usbFileViewerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the usbFileViewerApp
 */
angular.module('usbFileViewerApp')
  .controller('AudioCtrl', ['$scope', '$rootScope','$http','$log','$sce', function ($scope, $rootScope, $http,$log,$sce) {

  	$scope.userId = $rootScope.userId;
  	$scope.errorGettingFile = false;
  	$scope.error = {};

    $scope.getAudioFile = function(){
    	$log.log('Sending request for ' + $rootScope.audioId);
  		$http.jsonp($rootScope.apiPath + '/setupWebStream/' + $rootScope.audioId +
  					 '?callback=JSON_CALLBACK&userId=' + $rootScope.userId + '&groupId=' + $rootScope.groupId).
			  success(function(data) {
			  	var path = $rootScope.httpPath + '/' + data.filename;
			  	
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