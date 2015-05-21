'use strict';

/**
 * @ngdoc function
 * @name usbFileViewerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the usbFileViewerApp
 */
angular.module('usbFileViewerApp')
  .controller('FileCtrl', ['$scope', '$rootScope','$http','$log','$sce', function ($scope, $rootScope, $http,$log,$sce) {

  	$scope.userId = $rootScope.userId;
  	$scope.errorGettingFile = false;
  	$scope.error = {};

    $scope.getFile = function(){
    	$log.log('Sending request for ' + $rootScope.previewId);
  		$http.jsonp($rootScope.apiPath + '/setupWebStream/' + $rootScope.previewId +
  					 '?callback=JSON_CALLBACK&userId=' + $rootScope.userId + '&groupId=' + $rootScope.groupId).
			  success(function(data) {
			  	var path = $rootScope.httpPath + '/ViewerJS/#../' + data.filename;
			  	$log.log('Path = ' + path);
			  	$scope.fileIFrame = $sce.trustAsHtml('<iframe width="700" height="800" src="' + path + '"></iframe>');
			  	
			  	$log.log('Ready for streaming.');
			  	$scope.fileSetUp = true;
			  }).
			  error(function(data, status) {
			    $log.log('Failed with status: ' + status + '\nData: ' + data);
			   	$scope.errorGettingFile = true;
			    $scope.error = data;
			  });
    };

    $scope.getFile();
  }]);