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
  	//var serverPath = 'C:/Users/Patrick.pat-PC/Documents/School/Senior Design/wireless-usb-web-server/temp_files';

/*
    if($rootScope.isMobile && window.location.href.indexOf('mobile') === -1){
    	$log.log($rootScope);
      window.location = window.location.href + 'mobile';
    }*/

  	$scope.fileSetUp = false;

    $scope.getVideoFile = function(){
    	$log.log('Sending request for ' + $cookieStore.get('videoId'));
  		$http.jsonp($cookieStore.get('apiPath') + '/setupWebStream?callback=JSON_CALLBACK&accessToken=foo&fileId=' + $cookieStore.get('videoId')).
			  success(function(data) {
			  	var path = $cookieStore.get('httpPath') + '/' + data.filename;
			  	//var temp = path.split('.');
			  	//var fileType = temp[temp.length - 1];
			  	
			  	$scope.videoSource = $sce.trustAsHtml('<video controls>\n' +
			  												'<source src="' + path + '"\n' +
																'Your browser does not support the video element.\n' +
																'</video>');

					//$scope.audioSource = $sce.trustAsResourceUrl(path);
			  	
			  	$log.log('Ready for streaming.');
			  	$scope.fileSetUp = true;
			  }).
			  error(function(status,data) {
			    $log.log('Failed with status: ' + status + '\nData: ' + data);
			  });
    };
  }]);