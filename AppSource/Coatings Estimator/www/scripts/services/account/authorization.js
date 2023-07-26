/**
 * @ngdoc service
 * @name estimateApp.Authorization
 * @description
 * # Authorization
 * Factory in the estimateApp.
 */
angular.module('estimateApp')
    .factory('Authorization', ['$q', 'LocalService', 'AccessLevels', 'Config', 'Service', function ($q, LocalService, AccessLevels, Config, Service) {
        'use strict';
        var factory = this;

        var url = {
            login: 'api/v1/account/login',
            verify: 'api/v1/account/verify',
            register: 'api/v1/account/register',
            feedback: 'api/v1/account/feedback',
            forgotpassword: 'api/v1/account/forgotpassword',
            extendtoken: '/api/v1/account/extend',
            changepassword: 'api/v1/account/changepassword'
        };


        factory.CheckToken = function () {
            var authentication = LocalService.Get(Config.AuthTokenName);
            if (authentication) {
              var expiration = 0;
              try {
                expiration = new Date(JSON.parse(LocalService.Get(Config.AuthExpiration)));
              }
              catch(e) {
                console.warn(e);
              }
                //if (new Date() > Date.parse(JSON.parse(authentication).expires)) {
                if (new Date() > expiration) {
                    Service.UnsetConfigAuth();
                }
            }
        };

        factory.IsInRole = function (role) {
            return isInRole(role);
        };

        function isInRole(role) {
            var roles = JSON.parse(LocalService.Get(Config.AuthRoles));
            if (!roles) {
                return true;
            }
            return (_.intersection(roles, role).length > 0);

        }

        factory.IsAuthorized = function() {
            return true;
            var loginDetail = JSON.parse(LocalService.Get('loginDetail'));

            if (loginDetail == null)
                return false;

            return true;
        }

        factory._IsAuthorized = function (access) {
            //  var accessgranted = [AccessLevels.anon, AccessLevels.administrator];
            var accessgranted = [AccessLevels.anon];

            if ((_.intersection(accessgranted, access).length > 0)) {
                return true;
            }

            if (isInRole(access)) {
                return factory.IsAuthenticated();
            }
            return false;

        };

        factory.IsOwner = function (id) {
            return id === JSON.parse(LocalService.Get(Config.AuthId));
        };

        factory.IsAuthenticated = function () {
            factory.CheckToken();
            return LocalService.Get(Config.AuthTokenName);
        };

        factory.Verify = function (model) {
            var response = $q.defer();
            Service.Post(model, url.verify)
                .then(function (result) {
                    response.resolve(result);
                }, function (error) {
                    response.reject(error);
                });
            return response.promise;
        };

        factory.Login = function (user) {
            var response = $q.defer();

            Service.Post(user, url.login)
                .then(function (result) {
                    Service.SetConfigAuth(result);
                    response.resolve(result);
                }, function (error) {
                console.log(JSON.stringify(error));
                    response.reject(error);
                });
            return response.promise;
        };

        factory.ExtendToken = function () {
            var response = $q.defer();
            Service.Post({}, url.extendtoken)
                .then(function (result) {
                    Service.SetConfigAuth(result);
                    response.resolve(result);
                }, function (error) {
                    response.reject(error);
                });
            return response.promise;
        };

        factory.Logout = function () {
            var response = $q.defer();
            try {
                Service.UnsetConfigAuth();
                response.resolve(true);
            }
            catch (e) {
                response.reject(e);
            }
            return response.promise;
        };

        factory.Register = function (user) {
            var response = $q.defer();
            Service.Post(user, url.register)
                .then(function (result) {
                    Service.SetConfigAuth(result);
                    response.resolve(result);
                }, function (error) {
                    response.reject(error);
                });
            return response.promise;
        };

        factory.ForgotPassword = function (model) {
            return Service.Post(model, url.forgotpassword);
        };

        factory.Feedback = function (model) {
            return Service.Post(model, url.feedback);
        };

        factory.ChangePassword = function (user) {
            var response = $q.defer();
            Service.Post(user, url.changepassword)
                .then(function (result) {
                    Service.SetConfigAuth(result);
                    response.resolve(result);
                }, function (error) {
                    response.reject(error);
                });
            return response.promise;
        };

        return factory;
    }])
;
