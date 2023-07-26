'use strict';

describe('Service: ProjectDetail', function () {

  // load the service's module
  beforeEach(module('estimateApp'));

  // instantiate service
  var ProjectDetail;
  beforeEach(inject(function (_ProjectDetail_) {
    ProjectDetail = _ProjectDetail_;
  }));

  it('should do something', function () {
    expect(!!ProjectDetail).toBe(true);
  });

});
