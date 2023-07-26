'use strict';

describe('Service: System', function () {

  // load the service's module
  beforeEach(module('estimateApp'));

  // instantiate service
  var System;
  beforeEach(inject(function (_System_) {
    System = _System_;
  }));

  it('should do something', function () {
    expect(!!System).toBe(true);
  });

});
