'use strict';

angular.module('angularAppApp')
  .controller('UploadcsvCtrl', function ($scope, $modal, $http, $upload, socket) {
    $scope.errorLogs = [];

    $scope.statuses = ['OPEN', 'ANALYSED', 'FIXED', 'CLOSED', 'IGNORED', 'DUPLICATE'];

    $http.get('/api/errorLogs').success(function(errorLogs) {
      $scope.errorLogs = errorLogs;
      socket.syncUpdates('errorLog', $scope.errorLogs);
    });

	$scope.showStackTrace = function (item) {

	var temp = item;

    var modalInstance = $modal.open({
      templateUrl: 'app/uploadcsv/stacktrace.html',
      controller: 'ModalInstanceCtrl',
      size: 'lg',
      resolve: {
      	items: function(){
      		return item;
      	}
      }
    });
   
  };

    $scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
	    for (var i = 0; i < $files.length; i++) {
	      var file = $files[i];
	      uploadFile(file);
	      
	    }
		$http.get('/api/errorLogs').success(function(errorLogs) {
		      $scope.errorLogs = errorLogs;
		      socket.syncUpdates('errorLog', $scope.errorLogs);
		});

	};

	$scope.filterStatus = function() {
		var selectedStatus = $scope.selectedStatus;
		if(!_.isUndefined(selectedStatus) && selectedStatus) {
			$http.get('/api/errorLogs/status/' + selectedStatus).success(function(errorLogs) {
		      $scope.errorLogs = errorLogs;
		      //socket.syncUpdates('thing', $scope.errorLogs);
		    });
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
    
  })

 .controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.errorlog = items;
});
