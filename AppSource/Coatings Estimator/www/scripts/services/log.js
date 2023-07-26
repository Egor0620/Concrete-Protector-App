/**
 * @ngdoc service
 * @name estimateApp.log
 * @description
 * # log
 * Service in the estimateApp.
 */
angular.module('estimateApp')
    .service('Log', ['$window', function ($window) {
        'use strict';
        var service = this;

        service.Log = function (info) {
            if ($window.console) {
                if ($window.console.log) {
                    if (info) {
                        if (typeof info === 'object') {
                            $window.console.log(JSON.stringify(info));
                        }
                        else {
                            $window.console.log(info);
                        }

                    }
                }
            }
        };
        return service;

    }]);
