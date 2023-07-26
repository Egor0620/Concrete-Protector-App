/**
 * @ngdoc service
 * @name estimateApp.Utility
 * @description
 * # Utility
 * Service in the estimateApp.
 */
angular.module('estimateApp')
  .service('Utility', function Utility() {

    'use strict';

    var service = this;

    service.PopulateModel = function (source, changes) {
      for (var name in changes) {
        if (source.hasOwnProperty(name)) {
          source[name] = changes[name];
        }
      }
    };

    service.UpdateScopeModels = function (model, models) {
      var oldmodel = _.where(models, {'id': model.id})[0];
      if (oldmodel) {
        this.PopulateModel(oldmodel, model);
      }
      else {
        models.push(model);
      }
      return models;
    };

    service.RemoveModel = function (model, models) {
      var results = models
        .filter(function (el) {
          return el.id !== model.id;
        });
      models = results;
      return models;
    };

    service.CapitalizeFirstLetter = function (input) {
      return input.charAt(0).toUpperCase() + input.slice(1);
    };


    service.ValidEmail = function (email) {
      var regexp = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
      return regexp.test(email);
    };

    service.ValidPhone = function (phone) {
      var regexp = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
      return regexp.test(phone);
    };


    return service;
  });
