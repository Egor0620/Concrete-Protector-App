/**
 * @ngdoc service
 * @name estimateApp.Account
 * @description
 * # Account
 * Service in the estimateApp.
 */
angular.module('estimateApp')
    .service('Account', ['$rootScope', '$q', 'Config', 'Authorization', 'Reference', function Account($rootScope, $q, Config, Authorization, Reference) {
        'use strict';
        var service = this;

        service.IsAuthenticated = function () {
            return Authorization.IsAuthenticated();
        };

        service.Verify = function (model, callback) {
            var response = $q.defer();


            try {


                Authorization.Verify(model)
                    .then(function (result) {
                        callback(true, result);
                        response.resolve(result);
                    }, function (error) {
                        callback(false, error);
                        return response.reject(error);
                    });

                return response.promise;
            }
            catch (e) {
                response.reject(e);
                return response.promise;
            }
        };

        service.Register = function (model) {
            var response = $q.defer();
            var registerModel = {
                firstname: '',
                lastname: '',
                username: '',
                password: ''
            };

            var errors = [];
            if (!model.firstname || model.firstname.length === 0) {
                errors.push('missing first name');
            }
            else {
                registerModel.firstname = model.firstname;
            }

            if (!model.lastname || model.lastname.length === 0) {
                errors.push('missing last name');
            }
            else {
                registerModel.lastname = model.lastname;
            }


            if (!model.password || model.password.length === 0) {
                errors.push('missing password');
            }
            else {
                registerModel.password = model.password;
            }

            if (!model.confirmpassword || model.confirmpassword.length === 0) {
                errors.push('missing confirmation password');
            }

            if (model.confirmpassword && model.password) {
                if (model.confirmpassword !== model.password) {
                    errors.push('password and confirmation password do not match');
                }
            }

            if (!model.username || model.username.length === 0) {
                errors.push('missing email address');
            }
            else {
                registerModel.username = model.username;
            }


            if (errors.length > 0) {
                response.reject(errors);
                return response.promise;
            }

            try {


                Authorization.Register(registerModel)
                    .then(function (result) {
                        response.resolve(result);
                    }, function (error) {
                        Reference.ProcessError(error, errors);
                        response.reject(errors);
                        return response.promise;
                    });

                return response.promise;
            }
            catch (e) {
                response.reject(e);
                return response.promise;
            }
        };

        service.ExtendToken = function () {
            var response = $q.defer(),
                errors = [];
            try {
                Authorization.ExtendToken()
                    .then(function (result) {
                        response.resolve(result);
                    }, function (error) {
                        Reference.ProcessError(error, errors);
                        response.reject(errors);
                        return response.promise;
                    });
                return response.promise;
            }
            catch (e) {
                response.reject(e);
                return response.promise;
            }
        };

        service.Login = function (model) {
            var response = $q.defer();
            var loginModel = {
                username: '',
                password: ''
            };

            var errors = [];
            if (!model.username || model.username.length === 0) {
                errors.push('missing username');
            }
            else {
                loginModel.username = model.username;
            }

            if (!model.password || model.password.length === 0) {
                errors.push('missing password');
            }
            else {
                loginModel.password = model.password;
            }

            if (errors.length > 0) {
                response.reject(errors);
            }

            Authorization.Login(loginModel)
                .then(function (result) {
                    $rootScope.$broadcast(Config.UserAuthenticated);
                    response.resolve(result);
                }, function (error) {
                    Reference.ProcessError(error, errors);
                    response.reject(errors);
                });
            return response.promise;
        };

        service.ChangePassword = function (model) {
            var response = $q.defer();
            var changePasswordModel = {
                newpassword: '',
                password: ''
            };

            var errors = [];
            if (!model.password || model.password.length === 0) {
                errors.push('missing password');
            }
            else {
                changePasswordModel.password = model.password;
            }

            if (!model.newpassword || model.newpassword.length === 0) {
                errors.push('missing new password');
            }
            else {
                changePasswordModel.newpassword = model.newpassword;
            }

            if (errors.length > 0) {
                response.reject(errors);
            }

            Authorization.ChangePassword(changePasswordModel)
                .then(function (result) {
                    response.resolve(result);
                }, function (error) {
                    Reference.ProcessError(error, errors);
                    response.reject(errors);
                });
            return response.promise;
        };

        service.ForgotPassword = function (model) {
            var response = $q.defer();
            var forgotPasswordModel = {
                username: ''
            };

            var errors = [];
            if (!model.username || model.username.length === 0) {
                errors.push('missing username');
            }
            else {
                forgotPasswordModel.username = model.username;
            }

            if (errors.length > 0) {
                response.reject(errors);
            }

            Authorization.ForgotPassword(forgotPasswordModel)
                .then(function (result) {
                    response.resolve(result);
                }, function (error) {
                    Reference.ProcessError(error, errors);
                    response.reject(errors);
                });
            return response.promise;
        };

        service.Feedback = function (model) {
            var response = $q.defer();

            var errors = [];
            if (!model.feedback || model.feedback.length === 0) {
                errors.push('missing feedback');
            }
            if (errors.length > 0) {
                return response.reject(errors);
            }

            Authorization.Feedback(model)
                .then(function (result) {
                    return response.resolve(result);
                }, function (error) {
                    Reference.ProcessError(error, errors);
                    return response.reject(errors);
                });
            return response.promise;
        };

        return service;
    }]);
