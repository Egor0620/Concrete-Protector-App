/**
 * @ngdoc function
 * @name estimateApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
  .controller('LoginCtrl', ['$rootScope', '$state', '$scope', 'Account', function ($rootScope, $state, $scope, Account) {
    'use strict';

    function init() {

      $scope.errors = {};
      $scope.model = {};
      $scope.formInfo = {};


      if(Account.IsAuthenticated()){
        $state.go('index');
      }

      $scope.login = function (model) {

        Account.Login(model)
          .then(function () {

            var skipStates = [];
            skipStates.push('index.register');
            skipStates.push('index.login');

              $state.go('index');

          }, function (error) {
            $scope.errors = error;
          });
      };
    }

    init();
  }]);
