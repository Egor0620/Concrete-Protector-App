'use strict';

describe('Service: Navigation', function () {

  // load the service's module
  beforeEach(module('estimateApp'));

  // instantiate service
  var Navigation;
  beforeEach(inject(function (_Navigation_) {
    Navigation = _Navigation_;
  }));

  it('should do something', function () {
    expect(!!Navigation).toBe(true);
  });

});
