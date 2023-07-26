'use strict';

describe('Controller: EstimatelistCtrl', function () {

  // load the controller's module
  beforeEach(module('estimateApp'));

  var EstimatelistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EstimatelistCtrl = $controller('EstimatelistCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
