'use strict';

/**
 * @ngdoc function
 * @name usbFileViewerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the usbFileViewerApp
 */
angular.module('usbFileViewerApp')
  .controller('VideoCtrl', ['$scope', '$rootScope','$http','$log','$sce', function ($scope, $rootScope, $http,$log,$sce) {

  	$scope.userId = $rootScope.userId;
  	$scope.errorGettingFile = false;
  	$scope.error = {};

    $scope.getVideoFile = function(){
    	$log.log('Sending request for ' + $rootScope.videoId);
  		$http.jsonp($rootScope.apiPath + '/setupWebStream/' + $rootScope.videoId +
  					 '?callback=JSON_CALLBACK&userId=' + $rootScope.userId + '&groupId=' + $rootScope.groupId).
			  success(function(data) {
			  	var path = $rootScope.httpPath + '/' + data.filename;
			  	$log.log(path);
			  	
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