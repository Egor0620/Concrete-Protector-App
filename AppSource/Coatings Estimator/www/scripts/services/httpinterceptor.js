/**
 * @ngdoc service
 * @name estimateApp.AuthInterceptor
 * @description
 * # AuthInterceptor
 * Factory in the estimateApp.
 */
angular.module('estimateApp')
    .factory('HttpInterceptor', ['$q', '$injector', '$rootScope', function ($q, $injector, $rootScope) {
        'use strict';

        var factory = this;
        var config = $injector.get('Config');
        var restcount = 0;


        factory.request = function (request) {
            if (restcount < 0) {
                restcount = 0;
            }
            restcount++;
            var busy = restcount > 0;
            $rootScope.$broadcast(config.AjaxActivity, busy);

            var LocalService = $injector.get('LocalService');

            var token = LocalService.Get(config.AuthTokenName);

            if (token && token != "undefined") {
                token = angular.fromJson(token);
            }
            if (token && token != "undefined") {
                request.headers.Authorization = 'Bearer ' + token;
            }
            return request;
        };

        factory.response = function (response) {
            restcount--;
            var busy = restcount > 0;
            $rootScope.$broadcast(config.AjaxActivity, busy);
            return response;
        };


        factory.responseError = function (response) {
            restcount = 0;
            var busy = restcount > 0;
            $rootScope.$broadcast(config.AjaxActivity, busy);
            if (response.status === 401) {
                $rootScope.$broadcast(config.Http401);
                $injector.get('$state').go('index.login');
            }

            if (response.status === 403) {
                $rootScope.$broadcast(config.Http403, response.data.error);
            }
            if (response.status === 500) {
                $rootScope.$broadcast(config.Http500);
            }

            return $q.reject(response);
        };

        return factory;
    }]);
