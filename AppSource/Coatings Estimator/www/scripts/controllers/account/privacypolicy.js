/**
 * @ngdoc function
 * @name estimateApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
  .controller('PrivacyPolicyCtrl', ['$rootScope', '$state', '$scope', 'Account',
    function ($rootScope, $state, $scope, Account) {
      'use strict';

      function init() {
        $scope.saving = false;
        $scope.Model = {
          feedback: ''
        };

        $scope.feedback = function (model) {
          $scope.saving = true;
          var errors = [];
          model.errors = [];

          validate(model, errors);

          if (errors.length > 0) {
            model.errors = errors;
            model.error = errors.join(', ');
            $scope.saving = false;
            return model.error;
          }

          model.error = [];
          model.errors = [];

          Account.Feedback(model)
            .then(function () {
              $scope.saving = false;
              $rootScope.back();
            }, function (error) {
              $scope.saving = false;
              $scope.errors = error;
            });
        };

        $scope.Cancel = function () {
          $scope.saving = false;
          $rootScope.back();
        };

        function validate(model, errors) {

          if (model.feedback === '') {
            errors.push('missing feedback');
          }

        }
      }

      init();
    }]);
