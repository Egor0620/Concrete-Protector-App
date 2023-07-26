'use strict';

describe('Service: Address', function () {

  // load the service's module
  beforeEach(module('estimateApp'));

  // instantiate service
  var Address;
  beforeEach(inject(function (_Address_) {
    Address = _Address_;
  }));

  it('should do something', function () {
    expect(!!Address).toBe(true);
  });

});
