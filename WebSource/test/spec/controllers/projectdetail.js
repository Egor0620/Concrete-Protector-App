'use strict';

describe('Controller: ProjectdetailCtrl', function () {

  // load the controller's module
  beforeEach(module('estimateApp'));

  var ProjectdetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProjectdetailCtrl = $controller('ProjectdetailCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
