/**
 * @ngdoc function
 * @name estimateApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
  .controller('RegisterCtrl', ['$state', '$scope', 'Account', function ($state, $scope, Account) {

    'use strict';

    function init() {

      $scope.errors = {};
      $scope.model = {};
      $scope.formInfo = {};
      $scope.saving = false;
      $scope.register = function (model) {
        $scope.saving = true;
        Account.Register(model)
          .then(function () {
            $scope.saving = false;
            $state.go('index');
          }, function (error) {
            $scope.saving = false;
            $scope.errors = error;
          });
      };

      $scope.forgotpassword = function (model) {
        $scope.saving = true;
        Account.ForgotPassword(model)
          .then(function () {
            $scope.saving = false;
            $state.go('index.login');
          }, function (error) {
            $scope.saving = false;
            $scope.errors = error;
          });
      };
    }

    init();
  }]);
