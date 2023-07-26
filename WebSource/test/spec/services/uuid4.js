'use strict';

describe('Service: uuid4', function () {

  // load the service's module
  beforeEach(module('estimateApp'));

  // instantiate service
  var uuid4;
  beforeEach(inject(function (_uuid4_) {
    uuid4 = _uuid4_;
  }));

  it('should do something', function () {
    expect(!!uuid4).toBe(true);
  });

});
