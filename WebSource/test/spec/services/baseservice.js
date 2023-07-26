'use strict';

describe('Service: BaseService', function () {

  // load the service's module
  beforeEach(module('estimateApp'));

  // instantiate service
  var BaseService;
  beforeEach(inject(function (_BaseService_) {
    BaseService = _BaseService_;
  }));

  it('should do something', function () {
    expect(!!BaseService).toBe(true);
  });

});
