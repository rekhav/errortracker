'use strict';

angular.module('angularAppApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/uploadcsv', {
        templateUrl: 'app/uploadcsv/uploadcsv.html',
        controller: 'UploadcsvCtrl'
      });
  });
