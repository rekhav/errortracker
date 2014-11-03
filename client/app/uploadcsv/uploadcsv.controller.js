'use strict';

angular.module('angularAppApp')
  .controller('UploadcsvCtrl', function ($scope, $http, $upload) {
    $scope.message = '';

    $scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
	    for (var i = 0; i < $files.length; i++) {
	      var file = $files[i];
	      uploadFile(file);
	      
	    }
	};

	var uploadFile = function (file) {

		$scope.upload = $upload.upload({
	        url: 'api/uploadFile', //upload.php script, node.js route, or servlet url
	        method: 'POST',
	        headers: {'Content-Type': 'multipart/form-data'},
	        //withCredentials: true,
	        data: {myObj: $scope.myModelObj},
	        file: file 
	      }).progress(function(evt) {
	        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
	      }).success(function(data) {//, status, headers, config) {
	        // file is uploaded successfully
	        console.log(data);
	      });
	};
    
  });
