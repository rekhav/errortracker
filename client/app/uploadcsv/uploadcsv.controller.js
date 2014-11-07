'use strict';
angular.module('angularAppApp')
  .controller('UploadcsvCtrl', function ($scope, $modal, $http, $upload, socket) {
    $scope.errorLogs = [];
    $scope.filterdLogs = [];

    $scope.statuses = ['NEW', 'OPEN', 'ANALYSED', 'FIXED', 'RESOLVED', 'CLOSED', 'IGNORED', 'DUPLICATE'];
    $scope.systems = ['ROB', 'PIF', 'Prisma', 'BaNCS', 'eXimius', 'SIEBEL', 'RT', 'RASS'];
    $scope.releases = ['Q4-2014', 'Q4.1-2014', 'Q1-2015', 'Q2-2015', 'Q3-2015', 'Q4-2015'];
    
    var getAllErrorLogs = function () {
  		$http.get('/api/errorLogs').success(function(errorLogs) {
		      $scope.errorLogs = errorLogs;
		      socket.syncUpdates('errorLog', $scope.errorLogs);
		});
  	};


    getAllErrorLogs();

	$scope.updateLog = function(errorLog, fieldId, fieldValue) {
		if(fieldValue) {
				switch(fieldId) {
			case 'status':
				errorLog.status = fieldValue;
				break;
			case 'buildRelease':
				errorLog.buildRelease = fieldValue;
				break;
			case 'buildVersion':
				errorLog.buildVersion = fieldValue;
				break;
			case 'system':
				errorLog.system = fieldValue;
				break;
			case 'remark':
				errorLog.remark = fieldValue;
				break;
			default:
				console.log('not recognized fieldID so updating nothing' + fieldId);
				break;
		}
		
		$http.post('/api/errorLogs', { name: errorLog });
	      console.log("updated successfully");	
		}
	    
	};

	$scope.showInputs = function(modifiedStatus) {
	 	return modifiedStatus === 'FIXED';
	};

	$scope.showSystem = function(modifiedStatus) {
	 	return modifiedStatus === 'ANALYSED';
	};

	$scope.showStackTrace = function (item) {

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
		

	};

	$scope.filterColumn = function(selectedStatus, selectedSystem, selectedRelease) {
		// var selectedStatus = $scope.selectedStatus;
		console.log(selectedStatus);
		$http.get('/api/errorLogs').success(function(errorLogs) {
		    $scope.filterdLogs = errorLogs;
		    console.log($scope.filterdLogs);
		    console.log($scope.filterdLogs);
			if(!_.isUndefined(selectedStatus) && selectedStatus) {
				console.log($scope.filterdLogs);
		 		$scope.filterdLogs = _.filter($scope.filterdLogs, function (errorLog) { return errorLog.status === selectedStatus; });
	 			console.log($scope.filterdLogs);	 		
		 	}
		 	console.log('status.. '+ $scope.filterdLogs);
		 	if(!_.isUndefined(selectedSystem) && selectedSystem) {
		 			console.log('filtering by system' + selectedSystem);
		 			$scope.filterdLogs = _.filter($scope.filterdLogs, function (errorLog) { return errorLog.system === selectedSystem; });
		 			console.log($scope.filterdLogs);
	 		}
	 		if(!_.isUndefined(selectedRelease) && selectedRelease) {
	 			$scope.filterdLogs = _.filter($scope.filterdLogs, function (errorLog) { return errorLog.buildRelease === selectedRelease; });
	 		}		 	
		 	$scope.errorLogs = $scope.filterdLogs;

		});
					
		
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
