'use strict';

describe('Controller: UploadcsvCtrl', function () {

  // load the controller's module
  beforeEach(module('angularAppApp'));

  var UploadcsvCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UploadcsvCtrl = $controller('UploadcsvCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
