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
  	//var serverPath = 'C:/Users/Patrick.pat-PC/Documents/School/Senior Design/wireless-usb-web-server/temp_files';
  	var serverPath = 'http://192.168.1.250:8282/';

/*
    if($rootScope.isMobile && window.location.href.indexOf('mobile') === -1){
    	$log.log($rootScope);
      window.location = window.location.href + 'mobile';
    }*/

  	$scope.fileSetUp = false;

    $scope.getAudioFile = function(){
    	$log.log('Sending request for ' + $cookieStore.get('audioPath'));
  		$http.jsonp('http://192.168.1.250:3000/setupWebStream?callback=JSON_CALLBACK&accessToken=foo&path=' + $cookieStore.get('audioPath')).
			  success(function(data) {
			  	var path = serverPath + '/' + data.filename;
			  	//var temp = path.split('.');
			  	//var fileType = temp[temp.length - 1];
			  	
			  	$scope.audioSource = $sce.trustAsHtml('<audio src="' + path + '" controls>\n' +
																'Your browser does not support the audio element.\n' +
																'</audio>');

					//$scope.audioSource = $sce.trustAsResourceUrl(path);
			  	
			  	$log.log('Ready for streaming.');
			  	$scope.fileSetUp = true;
			  }).
			  error(function(status,data) {
			    $log.log('Failed with status: ' + status + '\nData: ' + data);
			  });
    };
  }]);