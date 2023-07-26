'use strict';

describe('Service: Lead', function () {

  // load the service's module
  beforeEach(module('estimateApp'));

  // instantiate service
  var Lead;
  beforeEach(inject(function (_Lead_) {
    Lead = _Lead_;
  }));

  it('should do something', function () {
    expect(!!Lead).toBe(true);
  });

});
