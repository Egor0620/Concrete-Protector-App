/**
 * @ngdoc service
 * @name estimateApp.IAP
 * @description
 * # Account
 * Service in the estimateApp.
 */
angular.module('estimateApp')
    .service('IAP', ['$q', '$rootScope', '$state', '$window', '$cordovaDevice', 'Config', 'Log','Account',
        function ($q, $rootScope, $state, $window, $cordovaDevice, Config, Log, Account) {
            'use strict';
          var service = this;
          var service = this;

          $rootScope.paid = Config.Purchased;

          service.init = function(ignoreStore) {

            $rootScope.paid = ignoreStore;

            $rootScope.showLoadingWheel();

            if (typeof(store) == "undefined") {
              $rootScope.hideLoadingWheel();
              return;
            }


            store.verbosity = store.DEBUG;

            store.register({
              id:    'paidversion_month', // id without package name!
              alias: 'paidversion_month',
              type:   store.PAID_SUBSCRIPTION
            });

            store.register({
              id:    'paidversion_year', // id without package name!
              alias: 'paidversion_year',
              type:   store.PAID_SUBSCRIPTION
            });

            store.register({
              id:    'test_dummy', // id without package name!
              alias: 'test_dummy',
              type:   store.CONSUMABLE
            });


            store.when("paidversion_month").updated(function(p) {
              //alert(JSON.stringify(p));

              if (p.owned) {
                $rootScope.paid = true;
                $state.go("index");
              }
              else {
                //alert("not paid!");
              }
            });

            store.when("paidversion_year").updated(function(p) {
              //alert(JSON.stringify(p));

              if (p.owned) {
                $rootScope.paid = true;
                $state.go("index");
              }
              else {
                //alert("yearly not paid!");
              }
            });

            store.ready(function() {
              $rootScope.hideLoadingWheel();
              //alert("Store is ready now.");
            });

            store.error(function(error) {
              $rootScope.hideLoadingWheel();
              alert(JSON.stringify(error));
            });

            store.when( "product" ).cancelled(function(product) {
              $rootScope.hideLoadingWheel();
            });

            store.when( "product" ).owned(function(product) {
              $rootScope.hideLoadingWheel();
            });

            store.when( "product" ).approved(function(product) {
              //alert(JSON.stringify(product));
              $rootScope.hideLoadingWheel();
              product.finish();
            });

            store.when( "product" ).error(function(product) {
              $rootScope.hideLoadingWheel();
            });


            store.refresh();
          };
          service.testBuy = function() {
            store.order("test_dummy");
          };
          service.buyMonthly = function() {
            $rootScope.showLoadingWheel();
            store.order("paidversion_month");
          };
          service.buyYearly = function() {
            $rootScope.showLoadingWheel();
            store.order("paidversion_year");
          };

          return service;
        }]);
