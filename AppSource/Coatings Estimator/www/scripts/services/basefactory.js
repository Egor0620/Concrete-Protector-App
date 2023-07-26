/**
 * @ngdoc factory
 * @name estimateApp.BaseFactory
 * @description
 * # BaseFactory
 * Factory in the estimateApp.
 * http://stackoverflow.com/questions/26642174/angularjs-service-inheritance
 */
angular.module('estimateApp')
  .factory('BaseFactory', ['Service', function (Service) {
    'use strict';

    function factory(name){
      this.url = {
        search: 'api/v1/' + name + '/search',
        add: 'api/v1/' + name,
        update: 'api/v1/' + name,
        remove: 'api/v1/' + name

      };
    }

    factory.prototype.Get = function (id) {
      var searchCriteria = {},
        criteria = [];
      criteria.push({'id': id});
      searchCriteria.criteria = criteria;
      return Service.Post(searchCriteria, this.url.search);
    };

    factory.prototype.Search = function (criteria, hints) {
      var message = {},
        searchHints = {
          searchType : 'use',
          populate : true
        };

      if (hints) {
        searchHints = hints;
      }
      message.hints = searchHints;
      message.criteria = criteria;
      return Service.Post(message, this.url.search);
    };

    factory.prototype.Add = function (model) {
      return Service.Post(model, this.url.add);
    };

    factory.prototype.Update = function (model) {
      return Service.Put(model, this.url.update);
    };

    factory.prototype.Remove = function (id) {
      return Service.Remove(id, this.url.remove);
    };

    return new factory();
  }]);
