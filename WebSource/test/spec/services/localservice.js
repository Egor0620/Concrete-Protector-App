'use strict';

describe('Service: localservice', function () {

  // load the service's module
  beforeEach(module('estimateApp'));

  // instantiate service
  var localservice;
  beforeEach(inject(function (_localservice_) {
    localservice = _localservice_;
  }));

  it('should do something', function () {
    expect(!!localservice).toBe(true);
  });

});
