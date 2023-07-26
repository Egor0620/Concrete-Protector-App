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
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
      /*
      var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      return re.test(email);
      */
    };

    service.ValidPhone = function (phone) {
      var regexp = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
      return regexp.test(phone);
    };


    return service;
  });
