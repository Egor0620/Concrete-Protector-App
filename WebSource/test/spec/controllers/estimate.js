'use strict';

describe('Controller: EstimateCtrl', function () {

  // load the controller's module
  beforeEach(module('estimateApp'));

  var EstimateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EstimateCtrl = $controller('EstimateCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
