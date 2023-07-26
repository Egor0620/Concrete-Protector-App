angular.module('estimateApp')
  .service('Storage', ['Service','BaseFactory', function (Service, BaseFactory) {
    'use strict';

    var service = this;

    var url = {
      uploadimg: 'api/v1/storage/uploadimage',
      search: 'api/v1/storage/search',
      add: 'api/v1/storage',
      update: 'api/v1/storage',
      remove: 'api/v1/storage'
    };

    service.GetFileImageString = function (id) {
      return Service.GetOne(url.add + '/' + id);
    };

    service.Get = function (id) {
      var searchCriteria = {},
        criteria = [];
      criteria.push({'id': id});
      searchCriteria.criteria = criteria;
      return Service.Post(searchCriteria, url.search);
    };

    service.Search = function (criteria, hints) {
      // need to specify storage type in hints
      var message = {},
        searchHints = {
          searchType : 'use',
          populate : false,
            storageType: '' // this needs to be specified!
        };

      if (hints) {
        searchHints = hints;
      }
      message.hints = searchHints;
      message.criteria = criteria;
      return Service.Post(message, url.search);
    };

    service.UploadImage = function (model) {
      return Service.Post(model, url.uploadimg);
    };

    service.Add = function (model) {
      return Service.Post(model, url.add);
    };

    service.Update = function (model) {
      return Service.Put(model, url.update);
    };

    service.Remove = function (id) {
      return Service.Remove(id, url.remove);
    };


 return service;

  }]);
