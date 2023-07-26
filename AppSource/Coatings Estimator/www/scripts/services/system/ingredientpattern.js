angular.module('estimateApp')
    .service('IngredientPattern', ['Service','BaseFactory', function (Service, BaseFactory) {
      'use strict';
      var service = function(){
        BaseFactory.constructor.call(this, 'ingredientpattern');
      };

      var url = {
        search: 'api/v1/ingredientpattern/search'
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
