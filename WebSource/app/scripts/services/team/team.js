angular.module('estimateApp')
  .service('Team', ['$q', 'Service', function ($q, Service) {
    'use strict';
    var service = this;

    var url = {
      search: 'api/v1/team/search',
      add: 'api/v1/team',
      remove: 'api/v1/team',
      update: 'api/v1/team'
    };

    service.Get = function (options) {
      var message = {};

      if(!options.critera){
        message.criteria = [];
      }
      else{
        message.criteria = options.criteria;
      }
      if(!options.mode){
        message.mode = 'use';
      }
      else{
        message.mode = options.mode;
      }
      if(!options.populate){
        message.populate = true;
      }
      else{
        message.populate = options.populate;
      }
      if(options.permission){
        message.permission = options.permission;
      }
      return Service.Post(message, url.search);
    };

    service.Add = function (model) {
      var response = $q.defer();
      Service.Post(model, url.add)
        .then(function(result) {
          return response.resolve(result);
        },
        function(error){
          return response.reject(error);
        });
      return response.promise;
    };

    service.Update = function (model) {
      var response = $q.defer();
      Service.Put(model, url.update)
        .then(function(result) {
          return response.resolve(result);
        },
        function(error){
          return response.reject(error);
        });
      return response.promise;
    };

    service.Remove = function (id) {
      return Service.Remove(id, url.remove);
    };

    service.CalculatePermissions = function(model){
      model.permission = 0;

      if(model.readsystem){
        model.permission += this.Permissions.ReadSystem;
      }
      if(model.editsystem){
        model.permission += this.Permissions.EditSystem;
      }
      if(model.readlead){
        model.permission += this.Permissions.ReadPerson;
      }
      if(model.editlead){
        model.permission += this.Permissions.EditPerson;
      }
      if(model.readfinancial){
        model.permission += this.Permissions.ReadFinancial;
      }
      if(model.editfinancial){
        model.permission += this.Permissions.EditFinancial;
      }
      if(model.readcontract){
        model.permission += this.Permissions.ReadContract;
      }
      if(model.editcontract){
        model.permission += this.Permissions.EditContract;
      }

    };

    service.PopulatePermissions = function(model){
      model.readsystem = (model.permission & this.Permissions.ReadSystem) > 0;

      model.editsystem = (model.permission & this.Permissions.EditSystem) > 0;

      model.readlead = (model.permission & this.Permissions.ReadPerson) > 0;

      model.editlead = (model.permission & this.Permissions.EditPerson) > 0;

      model.readfinancial = (model.permission & this.Permissions.ReadFinancial) > 0;

      model.editfinancial = (model.permission & this.Permissions.EditFinancial) > 0;

      model.readcontract =(model.permission & this.Permissions.ReadContract) > 0;

      model.editcontract = (model.permission & this.Permissions.EditContract) > 0;

    };

    service.Permissions = {
      ReadSystem: 1,
      EditSystem: 2,
      ReadPerson: 4,
      EditPerson: 8,
      ReadFinancial: 16,
      EditFinancial: 32,
      ReadContract: 64,
      EditContract: 128
    };

    return service;
  }]);
