'use strict';

describe('Service: Authorization', function () {

  // load the service's module
  beforeEach(module('estimateApp'));

  // instantiate service
  var Authorization;
  beforeEach(inject(function (_Authorization_) {
    Authorization = _Authorization_;
  }));

  it('should do something', function () {
    expect(!!Authorization).toBe(true);
  });

});
