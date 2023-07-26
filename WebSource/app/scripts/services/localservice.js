/**
 * @ngdoc service
 * @name estimateApp.localservice
 * @description
 * # localservice
 * Factory in the estimateApp.
 */
angular.module('estimateApp')
    .factory('LocalService', [function () {
        'use strict';
        var service = this;
        service.Get = function (key) {
            return localStorage.getItem(key);
        };

        service.Set = function (key, val) {
            return localStorage.setItem(key, val);
        };

        service.Unset = function (key) {
            return localStorage.removeItem(key);
        };

        return service;

    }]);
