/**
 * @ngdoc function
 * @name estimateApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
  .controller('PurchaseCtrl', ['$scope','$state', 'Authorization', 'IAP', 'uiHelper',
    function ($scope, $state, Authorization, IAP, uiHelper) {
    'use strict';

    $scope.init = function() {

    };
    $scope.testBuy = function() {
      IAP.testBuy();
    };
    $scope.buyMonthly = function() {
      if (!$scope.aggreed) {
        uiHelper.alert($scope, 'Agreement requried', 'Please read terms and conditions of use and aggree with that.');
        return;
      }

      IAP.buyMonthly();
    };
    $scope.buyYearly = function() {
      if (!$scope.aggreed) {
        uiHelper.alert($scope, 'Agreement requried', 'Please read terms and conditions of use and aggree with that.');
        return;
      }

      IAP.buyYearly();
    };

  }]);
