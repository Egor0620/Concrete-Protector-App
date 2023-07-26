angular.module('estimateApp')
  .service('Person', ['BaseFactory', function (BaseFactory) {
    'use strict';

    var service = function(){
      BaseFactory.constructor.call(this, 'person');
    };

    service.prototype = Object.create(BaseFactory.constructor.prototype);
    service.prototype.constructor = service;

    return new service();

  }]);
