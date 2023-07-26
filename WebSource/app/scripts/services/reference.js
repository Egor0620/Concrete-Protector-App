/**
 * @ngdoc service
 * @name estimateApp.reference
 * @description
 * # reference
 * Service in the estimateApp.
 */
angular.module('estimateApp')
  .service('Reference', ['$rootScope','Config', 'Service','ErrorHandler', function($rootScope, Config, Service, ErrorHandler) {
    'use strict';
    var service = this;

    var url = {
      states: 'api/v1/reference/states/',
      generic: 'api/v1/reference/generic/'
    };

    service.States = function (country) {
      return Service.GetList(url.states + country);
    };

    service.Countries = function () {
      return Service.GetList(url.generic + 'country');
    };

    service.PhoneTypes = function () {
      return Service.GetList(url.generic + 'phonetype');
    };

    service.AddressTypes = function () {
      return Service.GetList(url.generic + 'addresstype');
    };

    service.CleanError = function (dirtyError) {
      return ErrorHandler.CleanError(dirtyError);
    };

    service.ProcessError = function (error, errors) {
      return ErrorHandler.ProcessError(error, errors);
    };

    service.Statuses = [
      {key: '1', value: 'active'},
      {key: '0', value: 'inactive'}
    ];

    service.ProjectStatuses = [
      {key: 'estimate', value: 'estimate'},
      {key: 'current', value: 'current'},
      {key: 'complete', value: 'complete'}
    ];

    service.TrueFalse = [
      {key: true, value: 'true'},
      {key: false, value: 'false'}
    ];

    var pageTitle = 'Sign In';
    service.Title = function () {
      return pageTitle;
    };

    $rootScope.$on(Config.SetTitleEvent, function (event, data) {
      pageTitle = data;
    });

    return service;

  }]);
