'use strict';

describe('Controller: NewprojectdetailCtrl', function () {

  // load the controller's module
  beforeEach(module('estimateApp'));

  var NewprojectdetailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewprojectdetailCtrl = $controller('NewprojectdetailCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
