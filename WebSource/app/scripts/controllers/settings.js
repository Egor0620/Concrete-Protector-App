/**
 * @ngdoc function
 * @name estimateApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
  .controller('SettingsCtrl', ['$scope','$state', 'Authorization', function ($scope, $state, Authorization) {
    'use strict';

    function init() {

      $scope.IsInRoles = function (roles) {
        return Authorization.IsInRole(roles);
      };

      $scope.Logout = function () {
        Authorization.Logout()
          .then(function(result){
            $state.go('index.login');
          });

      };
    }

    init();

  }]);
