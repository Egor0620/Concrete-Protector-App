/**
 * @ngdoc function
 * @name estimateApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
  .controller('SettingsCtrl', ['$scope','$state', '$rootScope', 'Authorization',
    function ($scope, $state, $rootScope, Authorization) {
    'use strict';

    function init() {
      $scope.isPaidVersion = function() {
        return $rootScope.paid;
      }
      $scope.IsInRoles = function (roles) {
        return true;
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
