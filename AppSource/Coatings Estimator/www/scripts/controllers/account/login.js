/**
 * @ngdoc function
 * @name estimateApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
  .controller('LoginCtrl', ['$rootScope', '$state', '$scope', 'Account', 'IAP', 'Config', 'Authorization',
    function ($rootScope, $state, $scope, Account, IAP, Config, Authorization) {
    'use strict';

    function init() {

      $scope.errors = {};
      $scope.model = {};
      $scope.formInfo = {};


      if(Account.IsAuthenticated()) {
        IAP.init(Authorization.IsInRole(["concreteprotector"]));

        $state.go('index');
      }

      $scope.login = function (model) {

        Account.Login(model)
          .then(function () {
            var skipStates = [];

            skipStates.push('index.register');
            skipStates.push('index.login');

            IAP.init(Authorization.IsInRole(["concreteprotector"]));


            $state.go('index');

          }, function (error) {
            //alert(JSON.stringify(error));
            $scope.errors = error;
          });
      };
    }

    init();
  }]);
