'use strict';

describe('Service: reference', function () {

  // load the service's module
  beforeEach(module('estimateApp'));

  // instantiate service
  var reference;
  beforeEach(inject(function (_reference_) {
    reference = _reference_;
  }));

  it('should do something', function () {
    expect(!!reference).toBe(true);
  });

});
