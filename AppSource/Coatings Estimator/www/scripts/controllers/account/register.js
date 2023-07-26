/**
 * @ngdoc function
 * @name estimateApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
  .controller('RegisterCtrl', ['$state', '$rootScope', '$scope', 'Account', 'Utility', 'uiHelper',
    function ($state, $rootScope, $scope, Account, Utility, uiHelper) {

    'use strict';

    function init() {

      $scope.errors = {};
      $scope.model = {};
      $scope.formInfo = {};
      $scope.saving = false;
      $scope.register = function (model) {

        if (typeof(model.firstname) == "undefined" || model.firstname.length < 3) {
          $rootScope.alert("First name should be longer than 3 letters.");
          return;
        }

        if (typeof(model.lastname) == "undefined" || model.lastname.length < 3) {
          $rootScope.alert("Last name should be longer than 3 letters.");
          return;
        }

        if (typeof(model.username) == "undefined" || !Utility.ValidEmail(model.username)) {
          $rootScope.alert("Email is not valid.");
          return;
        }

        if (typeof(model.password) == "undefined" || model.password.length < 3) {
          $rootScope.alert("Password should be longer than 6 letters.");
          return;
        }

        if (typeof(model.confirmpassword) == "undefined" || model.confirmpassword.length < 6) {
          $rootScope.alert("Confirmpassword should be longer than 6 letters.");
          return;
        }

        if (typeof(model.confirmpassword) == "undefined" || model.confirmpassword.length < 6) {
          $rootScope.alert("Confirmpassword should be longer than 6 letters.");
          return;
        }

        if (model.password != model.confirmpassword) {
          $rootScope.alert("Password and confirm password should be same.");
          return;
        }


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
