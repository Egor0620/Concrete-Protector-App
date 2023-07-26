'use strict';

describe('Service: errorhandler', function () {

  // load the service's module
  beforeEach(module('estimateApp'));

  // instantiate service
  var errorhandler;
  beforeEach(inject(function (_errorhandler_) {
    errorhandler = _errorhandler_;
  }));

  it('should do something', function () {
    expect(!!errorhandler).toBe(true);
  });

});
