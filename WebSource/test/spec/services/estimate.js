'use strict';

describe('Service: Estimate', function () {

  // load the service's module
  beforeEach(module('estimateApp'));

  // instantiate service
  var Estimate;
  beforeEach(inject(function (_Estimate_) {
    Estimate = _Estimate_;
  }));

  it('should do something', function () {
    expect(!!Estimate).toBe(true);
  });

});
