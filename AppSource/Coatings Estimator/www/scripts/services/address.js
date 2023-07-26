/**
 * @ngdoc service
 * @name estimateApp.Address
 * @description
 * # Address
 * Service in the estimateApp.
 */
angular.module('estimateApp')
  .service('Address', ['BaseFactory', function (BaseFactory) {
    'use strict';

    var service = function(){
      BaseFactory.constructor.call(this, 'address');
    };

    service.prototype = Object.create(BaseFactory.constructor.prototype);
    service.prototype.constructor = service;

    return new service();

  }]);
