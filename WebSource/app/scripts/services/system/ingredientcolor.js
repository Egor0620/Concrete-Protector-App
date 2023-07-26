angular.module('estimateApp')
  .service('IngredientColor', ['Service','BaseFactory', function (Service, BaseFactory) {
    'use strict';
    var service = function(){
      BaseFactory.constructor.call(this, 'ingredientcolor');
    };

    var url = {
      search: 'api/v1/ingredientcolor/search'
    };

    service.GetAll = function () {
      var searchCriteria = {};
      searchCriteria.criteria = [];
      return Service.Post(searchCriteria, url.search);
    };

    service.prototype = Object.create(BaseFactory.constructor.prototype);
    service.prototype.constructor = service;

    return new service();
  }]);
