'use strict';

/**
 * @ngdoc function
 * @name usbFileViewerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the usbFileViewerApp
 */
angular.module('usbFileViewerApp')
  .controller('MainCtrl',['$scope','$cookieStore', '$log', '$http', function ($scope,$cookieStore,$log,$http) {
    var navFilePath = '';

    $scope.query = '';
    $scope.category = 'filename';
    $scope.reverse = false;

    if($cookieStore.get('files') === undefined){
      $scope.files = [];
    }
    else{
      $scope.files = $cookieStore.get('files');
    }

    if($cookieStore.get('currFilePath') === undefined){
      $scope.currFilePath = '';
    }
    else{
      $scope.currFilePath = $cookieStore.get('currFilePath');
    }

    $scope.getFileListing = function(path){
      // replace mock with the http call to the REST API to receive the files
      $http.jsonp('http://localhost:3000/fileListing?callback=JSON_CALLBACK&accessToken=foo&path=' + path).
        success(function(data) {
          $scope.files = data.files;
          $scope.currFilePath = path;

          $cookieStore.put('files', $scope.files);
          $cookieStore.put('currFilePath', $scope.currFilePath);
        }).
        error(function(status,data) {
          $log.log('Failed with status: ' + status + '\nData: ' + data);
        });
    };

    $scope.getPathName = function(path){
      if(path === ''){
        return 'Root';
      }
      else{
        return path;
      }
    };

    $scope.getNavFilePath = function(ind,filePath){
      $log.log('CurrFilePath: ' + $scope.currFilePath + '\nIndex: ' + ind + '\nPath: ' + filePath);
      if(ind === 0){
        navFilePath = filePath;
      }
      else{
        navFilePath += '/' + filePath;
      }
      return navFilePath;
    };

    $scope.isAudioFile = function(filename){
      return filename.indexOf('.mp3') > -1;
    };

    $scope.setAudioPath = function(path){
      $cookieStore.put('audioPath',path);
    };
/*
    var mockFileListing = function(path){
      if(path === '' || path === 'USB'){
        return {
          'files':[
            {'filename':'folder1','size':0,'isDirectory':true},
            {'filename':'sample.txt','size':1000,'isDirectory':false},
            {'filename':'song1.mp3','size':12000,'isDirectory':false},
            {'filename':'report.docx','size':2004,'isDirectory':false},
            {'filename':'song2.mp3','size':48174,'isDirectory':false},
            {'filename':'presentation.pptx','size':41000,'isDirectory':false},
            {'filename':'budget.xlsx','size':5550,'isDirectory':false},
            {'filename':'movie1.mp4','size':6500000,'isDirectory':false},
            {'filename':'movie2.mp4','size':7200000,'isDirectory':false},
            {'filename':'paper.pdf','size':45000,'isDirectory':false},
            {'filename':'resume.pdf','size':4700,'isDirectory':false}
          ],
          'currFilePath':'USB'
        };
      }
      else if(path === 'USB/folder1'){
        return {
          'files':[
            {'filename':'sample3.txt','size':1008,'isDirectory':false}
          ],
          'currFilePath':path
        };
      }
      else{
        return {'files':{},'currFilePath':''};
      }
    };
    */
  }]);
