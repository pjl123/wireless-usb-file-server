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
    var apiServerAddress = 'http://192.168.1.36:3000';

    var mobilecheck = function() {
      var check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))){check=true;}})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    };
    var isMobile = mobilecheck();

    if(isMobile && window.location.href.indexOf('mobile') === -1){
      window.location = window.location.href + 'mobile';
    }

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
      $http.jsonp(apiServerAddress + '/fileListing?callback=JSON_CALLBACK&accessToken=foo&path=' + path).
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
