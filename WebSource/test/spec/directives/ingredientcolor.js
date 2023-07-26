'use strict';

describe('Directive: ingredientcolor', function () {

  // load the directive's module
  beforeEach(module('estimateApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ingredientcolor></ingredientcolor>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ingredientcolor directive');
  }));
});
