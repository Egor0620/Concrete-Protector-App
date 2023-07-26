/**
 * @ngdoc service
 * @name estimateApp.Service
 * @description
 * # Service
 * Service in the estimateApp.
 */
angular.module('estimateApp')
  .service('Service', ['$q','$rootScope', 'Config', 'Restangular', 'ErrorHandler', 'LocalService',
    function ($q,$rootScope, Config, Restangular, ErrorHandler, LocalService) {

    'use strict';

    var service = this;

    /*

     var LocalService = $injector.get('LocalService');
     LocalService.Unset(config.AuthTokenName);
     LocalService.Unset(config.AuthRoles);
     LocalService.Unset(config.AuthUserName);
     LocalService.Unset(config.AuthId);
     */

    Restangular.addResponseInterceptor(function (data, operation, route, url, response, deferred, httpConfig) {

      if (response.headers().extend) {
        var extend = JSON.parse(response.headers().renewtoken);
        setConfigAuth(extend);

      }
      return response.data;
    });

    function setConfigAuth(result) {
      LocalService.Set(Config.AuthTokenName, JSON.stringify(result.token));
      LocalService.Set(Config.AuthRoles, JSON.stringify(result.roles));
      LocalService.Set(Config.AuthUserName, JSON.stringify(result.name));
      LocalService.Set(Config.AuthId, JSON.stringify(result.id));
      LocalService.Set(Config.AuthExpiration, JSON.stringify(result.expires));
    }

    function unSetConfigAuth() {
      LocalService.Unset(Config.AuthTokenName);
      LocalService.Unset(Config.AuthRoles);
      LocalService.Unset(Config.AuthUserName);
      LocalService.Unset(Config.AuthId);
      LocalService.Unset(Config.AuthExpiration);
    }

    service.SetConfigAuth = function (result) {
      return setConfigAuth(result);
    };

    service.UnsetConfigAuth = function () {
      return unSetConfigAuth();
    };

    service.Post = function (message, url) {
      var response = $q.defer();
      var errors = [];

      Restangular
        .all(url)
        .post(message, {})
        .then(function (result) {
          response.resolve(result);
        }, function (error) {
          ErrorHandler.ProcessError(error, errors);
          response.reject(errors);
        });
      return response.promise;
    };

    service.Put = function (message, url) {
      var response = $q.defer(),
        errors = [];
      Restangular
        .one(url)
        .customPUT(message)
        .then(function (result) {
          response.resolve(result);
        }, function (error) {
          ErrorHandler.ProcessError(error, errors);
          response.reject(errors);
        });
      return response.promise;
    };

    service.Remove = function (id, url) {
      var response = $q.defer();
      var errors = [];
      Restangular
        .one(url + '/' + id)
        .customDELETE()
        .then(function (result) {
          response.resolve(result);
        }, function (error) {
          ErrorHandler.ProcessError(error, errors);
          response.reject(errors);
        });
      return response.promise;
    };

    service.GetList = function (url) {
      var response = $q.defer();
      var errors = [];
      Restangular
        .all(url).getList()
        .then(function (result) {
          response.resolve(result);
        }, function (error) {
          ErrorHandler.ProcessError(error, errors);
          response.reject(errors);
        });
      return response.promise;
    };

    service.GetOne = function (url) {
      var response = $q.defer();
      var errors = [];
      Restangular
        .oneUrl(url).get()
        .then(function (result) {
          response.resolve(result);
        }, function (error) {
          ErrorHandler.ProcessError(error, errors);
          response.reject(errors);
        });

      return response.promise;
    };


      $rootScope.$on(Config.Http401, function (event, data) {
        unSetConfigAuth();
      });

    return this;
  }]);
