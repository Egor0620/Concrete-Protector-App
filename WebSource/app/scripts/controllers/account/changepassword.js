/**
 * @ngdoc function
 * @name estimateApp.controller:ChangePasswordCtrl
 * @description
 * # ChangePasswordCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
  .controller('ChangePasswordCtrl', ['$rootScope', '$state', '$scope', 'Account', function ($rootScope, $state, $scope, Account) {
    'use strict';

    function init() {
      $scope.saving = false;
      $scope.Model = {
        password: '',
        newpassword: '',
        confirmnewpassword: ''
      };

      $scope.ChangePassword = function (model) {
        $scope.saving = true;
        var errors = [];
        model.errors = [];

        validate(model, errors);

        if (errors.length > 0) {
          model.errors = errors;
          model.error = errors.join(', ');
          return model.error;
        }

        Account.ChangePassword(model)
          .then(function () {
            $scope.saving = false;
            var skipStates = [];
            skipStates.push('index.register');
            skipStates.push('index.login');

            var skipPrevious = _.contains(skipStates, $rootScope.appTargetStateName);

            if ($rootScope.appTargetStateName && !skipPrevious) {
              $rootScope.back();
            } else {
              $state.go('index');
            }

          }, function (error) {
            model.errors = error;
            $scope.saving = false;
            model.error = model.errors.join(', ');
          });
      };

      $scope.Cancel = function () {
        $rootScope.back();
      };

      function validate(model, errors) {

        if (model.password === '') {
          errors.push('missing password');
        }

        if (model.newpassword === '') {
          errors.push('missing new password');
        }

        if (model.confirmnewpassword === '') {
          errors.push('missing confirmation password');
        }

        if (model.confirmnewpassword !== '' && model.newpassword !== '') {
          if (model.confirmnewpassword.toLowerCase() !== model.newpassword.toLowerCase()) {
            errors.push('new password does not match confirmation password');
          }
        }
      }

    }

    init();
  }]);
