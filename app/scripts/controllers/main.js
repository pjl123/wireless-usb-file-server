'use strict';

/**
 * @ngdoc function
 * @name usbFileViewerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the usbFileViewerApp
 */
angular.module('usbFileViewerApp')
  .controller('MainCtrl',['$scope','$rootScope','$cookieStore', '$log', '$http', '$routeParams', function ($scope,$rootScope,$cookieStore,$log,$http,$routeParams) {
    var navFilePath = '';
    // Store the server paths for use across all modules
    $cookieStore.put('selfPath','http://192.168.1.146:9000');
    $cookieStore.put('httpPath','http://192.168.1.146:8282');
    $cookieStore.put('apiPath','https://192.168.1.146:3000');

    var mobilecheck = function () {
      var check = false;
      (function (a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))){check=true;}})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    };
    $rootScope.isMobile = mobilecheck();

    if($rootScope.isMobile && window.location.href.indexOf('mobile') === -1){
      window.location = window.location.href + 'mobile';
    }

    $scope.groupQuery = '';
    $scope.groupReverse = false;

    $scope.query = '';
    $scope.category = 'filepath';
    $scope.reverse = false;

    if($routeParams.userId === undefined){
      $scope.userId = $cookieStore.get('userId');
      if($scope.userId === undefined){
        // Hard coded web user id
        $scope.userId = '552ea5dac6ef4a5c19b242b1';
      }
    }
    else{
      $scope.userId = $routeParams.userId;
    }
    $cookieStore.put('userId',$scope.userId);

    $scope.groups = [];
    $scope.files = [];
    $scope.currentGroup = {};
    $scope.currentDirectory = {};
    $scope.currentFiles = [];

    var findFiles = function (directory){
      $scope.currentFiles = [];
      var dirId = directory._id;
      if(dirId === undefined){
        dirId = null;
      }
      for (var i = 0; i < $scope.files.length; i++) {
        if($scope.files[i].parentDirectory === dirId){
          $scope.currentFiles.push($scope.files[i]);
        }
      }
      $log.log($scope.currentFiles);
    };

    $scope.getPaths = function (directory){
      if(directory.filepath === undefined){
        return [''];
      }
      else{
        return directory.filepath.split('/');
      }
    };

    // TODO damn jsonp requests don't let you set headers...
    $scope.getGroups = function (userId){
      $http.jsonp($cookieStore.get('apiPath') + '/groupsByUser/' + userId + '?callback=JSON_CALLBACK&userId=' + userId).
        success(function (data) {
          $scope.groups = data.groups;
        }).
        error(function (status,data) {
          $log.log('Failed with status: ' + status + '\nData: ' + data);
        });
    };

    $scope.getGroups($scope.userId);

    $scope.getFiles = function (group, userId){
      $http.jsonp($cookieStore.get('apiPath') + '/filesByGroup/' + group._id + '?callback=JSON_CALLBACK&userId=' + userId).
        success(function (data) {
          $scope.files = data.files;
          for (var i = 0; i < $scope.files.length; i++) {
            var temp = $scope.files[i].filepath.split('/');
            $scope.files[i].filename = temp[temp.length - 1];
          }
          $scope.currentGroup = group;
          $scope.currentDirectory = {};
          findFiles($scope.currentDirectory);
        }).
        error(function (status,data) {
          $log.log('Failed with status: ' + status + '\nData: ' + data);
        });
    };

    $scope.getPathName = function (path){
      if(path === ''){
        return 'USBs';
      }
      else{
        return path;
      }
    };

    $scope.getNavFile = function (ind){
      var paths = $scope.getPaths($scope.currentDirectory);
      navFilePath = '';
      for (var i = 0; i <= ind; i++) {
        if(i > 0){
          navFilePath += '/';
        }
        navFilePath += paths[i];
      }
      var returnDir = {};
      for (var j = 0; j < $scope.files.length; j++) {
        if($scope.files[j].filepath === navFilePath){
          returnDir = $scope.files[j];
          break;
        }
      }
      $log.log('navFilePath: ' + navFilePath + '\nIndex: ' + ind);
      $log.log('Return directory: ' + returnDir.filepath);
      return returnDir;
    };

    $scope.isAudioFile = function (file){
      return (file.filepath.indexOf('.mp3') > -1 || file.filepath.indexOf('.wav') > -1);
    };

    $scope.isVideoFile = function (file){
      return (file.filepath.indexOf('.mp4') > -1 || file.filepath.indexOf('.wmv') > -1);
    };

    $scope.setAudioFileId = function (fileId){
      $cookieStore.put('audioId',fileId);
      $cookieStore.put('groupId',$scope.currentGroup._id);
    };

    $scope.setVideoFileId = function (fileId){
      $cookieStore.put('videoId',fileId);
      $cookieStore.put('groupId',$scope.currentGroup._id);
    };

    $scope.processFile = function (file){
      if(file.isDirectory || file.isDirectory === undefined){
        $scope.currentDirectory = file;
        findFiles($scope.currentDirectory);
      }
      else if($scope.isAudioFile(file)){
        $scope.setAudioFileId(file._id);
        var audioSite = $rootScope.isMobile ? $cookieStore.get('selfPath') + '/#/audio/mobile' : $cookieStore.get('selfPath') + '/#/audio';
        window.location.href = audioSite;
        $log.log(window.location);
      }
      else if($scope.isVideoFile(file)){
        $scope.setVideoFileId(file._id);
        var videoSite = $rootScope.isMobile ? $cookieStore.get('selfPath') + '/#/video/mobile' : $cookieStore.get('selfPath') + '/#/video';
        window.location.href = videoSite;
        $log.log(window.location);
      }
    };
  }]);