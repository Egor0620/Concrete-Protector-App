/**
 * @ngdoc function
 * @name estimateApp.controller:SubscribeCtrl
 * @description
 * # SubscribeCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
    .controller('SubscribeCtrl', ['$rootScope', '$state', '$scope', 'Account', 'IAP','Config','Log',
        function ($rootScope, $state, $scope, Account, IAP, Config, Log) {
            'use strict';

            $scope.Products = IAP.products;

            function init() {

                $scope.Buy = function (product) {
                    IAP.Buy(product);
                };

                $scope.Test = function () {
                    IAP.Test();
                };


                $scope.Cancel = function () {
                    $scope.saving = false;
                    $rootScope.back();
                };

            }

            $rootScope.$on(Config.ProductSetup, function () {
                $scope.Products = IAP.products;
            });

            $rootScope.$on(Config.SubscriptionPurchased, function (p) {
                Log.Log('subscription purchased');
            });

            $rootScope.$on(Config.SubscriptionExpired, function (p) {
                Log.Log('subscription expired');
            });

            init();
        }]);
