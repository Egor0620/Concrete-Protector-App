/**
 * @ngdoc service
 * @name estimateApp.Phone
 * @description
 * # Phone
 * Service in the estimateApp.
 */
angular.module('estimateApp')
  .service('Note', ['BaseFactory', function (BaseFactory) {
    'use strict';

    var service = function(){
      BaseFactory.constructor.call(this, 'note');
    };

    service.prototype = Object.create(BaseFactory.constructor.prototype);
    service.prototype.constructor = service;

    return new service();

  }]);
