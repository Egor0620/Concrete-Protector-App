/**
 * @ngdoc service
 * @name estimateApp.IAP
 * @description
 * # Account
 * Service in the estimateApp.
 */
angular.module('estimateApp')
    .service('IAP', ['$q', '$rootScope', '$window', '$cordovaDevice', 'Config', 'Log','Account',
        function ($q, $rootScope, $window, $cordovaDevice, Config, Log, Account) {
            'use strict';
            var service = this,
                products = [];

            service.products = products;

            service.Buy = function (product) {
                // Log.Log('buy ' + product);
                store.order(product.id);
            };

            service.Test = function(){
                initStore();
            }

           // $rootScope.$on(Config.AppStart, function () {
            $rootScope.$on(Config.UserAuthenticated, function () {
                initStore();
            });

            var store = {};

            function initStore() {
                if (!$window.store) {
                    setupFakeStore();
                }
                else {
                    setupStore();
                }
            }

            function setupFakeStore() {
                $rootScope.$broadcast(Config.StoreInit, {'loaded': false});
                Log.Log('store not initialized');
                store.register = function (period) {
                    Log.Log('registered store ' + period);
                };

                store.ready = function () {
                    Log.Log('store ready');
                };
                store.refresh = function () {
                    Log.Log('refresh store');
                };

                store.get = function (period) {
                    Log.Log('get store ' + period);
                };

                store.order = function (period) {
                    Log.Log('store order ' + period);
                };

                store.PAID_SUBSCRIPTION = 'paid subscription';

                store.DEBUG = 'DEBUG';
                store.ERROR = 'ERROR';

            }

            function setupStore() {
                $rootScope.$broadcast(Config.StoreInit, {'loaded': true});
                Log.Log('store initialized');
                store = $window.store;


                // var platform = $cordovaDevice.getPlatform();
                //Returns String — eg: "iOS", "Android", "WinCE"
                //store.verbosity = store.DEBUG;
                store.verbosity = store.ERROR;
                store.verify = Account.Verify;

                var monthly = {
                    id: 'monthly',
                    alias: 'Montly',
                    type: store.PAID_SUBSCRIPTION
                };

                var yearly = {
                    id: 'yearly',
                    alias: 'Yearly',
                    type: store.PAID_SUBSCRIPTION
                };


                store.register(monthly);
                store.register(yearly);

                store.ready(function (storeResult) {
                    Log.Log('store result ' + storeResult);
                    Log.Log("\\o/ STORE READY \\o/");
                });

                store.off(function(storeOff){
                    Log.Log('store off');
                    Log.Log(storeOff);
                });

                store.refresh();


                //var yearlySubscription = store.get(yearly.id);
                //var monthlySubscription = store.get(monthly.id);

                store.when(monthly.id).loaded(setupProduct);
                store.when(yearly.id).loaded(setupProduct);


                /*
                 store.when("product").updated(function (p) {
                 if (typeof p === 'object') {
                 setupProduct(p);
                 }
                 else {
                 Log.Log('product updated ' + p);
                 }

                 });
                 */

                store.when(monthly.id).approved(function (p) {
                    p.verify();
                    Log.Log('monthly approved');

                });

                store.when(monthly.alias).verified(function (p) {
                    p.finish();
                    Log.Log('monthly verified');
                });

                store.when(monthly.alias).unverified(function (p) {
                    Log.Log('monthly unverified');

                });

                store.when(monthly.alias).updated(function (p) {
                    Log.Log('monthly updated');
                    if (p.owned) {
                        Log.Log('monthly owned');
                        Log.Log(p);
                        $rootScope.$broadcast(Config.SubscriptionPurchased, p);
                    }
                    else {
                        $rootScope.$broadcast(Config.SubscriptionExpired, p);
                    }
                });

                store.when(yearly.id).approved(function (p) {
                    p.verify();
                    Log.Log('yearly approved');
                });

                store.when(yearly.alias).verified(function (p) {
                    p.finish();
                    Log.Log('yearly verified');
                });

                store.when(yearly.alias).unverified(function (p) {
                    Log.Log('yearly unverified');
                });

                store.when(yearly.alias).updated(function (p) {
                    Log.Log('yearly updated');
                    if (p.owned) {
                        Log.Log('yearly owned');
                        Log.Log(p);
                        $rootScope.$broadcast(Config.SubscriptionPurchased);
                    }
                    else {
                        $rootScope.$broadcast(Config.SubscriptionExpired);
                    }
                });

            }

            function setupStore_prime() {
                $rootScope.$broadcast(Config.StoreInit, {'loaded': true});
                Log.Log('store initialized');
                store = $window.store;


                // var platform = $cordovaDevice.getPlatform();
                //Returns String — eg: "iOS", "Android", "WinCE"
                //store.verbosity = store.DEBUG;
                store.verbosity = store.ERROR;

                var monthly = {
                    id: 'monthly',
                    alias: 'Montly',
                    type: store.PAID_SUBSCRIPTION
                };

                var yearly = {
                    id: 'yearly',
                    alias: 'Yearly',
                    type: store.PAID_SUBSCRIPTION
                };


                store.register(monthly);
                store.register(yearly);

                store.ready(function (storeResult) {
                    Log.Log('store result ' + storeResult);
                    Log.Log("\\o/ STORE READY \\o/");
                });

                store.refresh();
                //var yearlySubscription = store.get(yearly.id);
                //var monthlySubscription = store.get(monthly.id);

                store.when(monthly.id).loaded(setupProduct);
                store.when(yearly.id).loaded(setupProduct);


                /*
                 store.when("product").updated(function (p) {
                 if (typeof p === 'object') {
                 setupProduct(p);
                 }
                 else {
                 Log.Log('product updated ' + p);
                 }

                 });
                 */

                store.when(monthly.id).approved(function (p) {
                    p.verify();
                    Log.Log('monthly approved');

                });

                store.when(monthly.alias).verified(function (p) {
                    p.finish();
                    Log.Log('monthly verified');
                });

                store.when(monthly.alias).unverified(function (p) {
                    Log.Log('monthly unverified');

                });

                store.when(monthly.alias).updated(function (p) {
                    Log.Log('monthly updated');
                    if (p.owned) {
                        Log.Log('monthly owned');
                        Log.Log(p);
                        $rootScope.$broadcast(Config.SubscriptionPurchased, p);
                    }
                    else {
                        $rootScope.$broadcast(Config.SubscriptionExpired, p);
                    }
                });

                store.when(yearly.id).approved(function (p) {
                    p.verify();
                    Log.Log('yearly approved');
                });

                store.when(yearly.alias).verified(function (p) {
                    p.finish();
                    Log.Log('yearly verified');
                });

                store.when(yearly.alias).unverified(function (p) {
                    Log.Log('yearly unverified');
                });

                store.when(yearly.alias).updated(function (p) {
                    Log.Log('yearly updated');
                    if (p.owned) {
                        Log.Log('yearly owned');
                        Log.Log(p);
                        $rootScope.$broadcast(Config.SubscriptionPurchased);
                    }
                    else {
                        $rootScope.$broadcast(Config.SubscriptionExpired);
                    }
                });

            }

            var setupProduct = function setupProduct(product) {
                Log.Log('setup product');
                var possible = _.where(products, {id: product.id});
                syncProduct(possible, product);
            };

            function syncProduct(possible, product) {
                Log.Log('sync product');


                if (possible.length === 0) {
                    Log.Log('not possible');
                    products.push(product);
                } else {
                    var maybe = _.where(possible, {id:product.id});
                    Log.Log('possible');
                    Log.Log(possible);
                    if(maybe.length === 0 ){
                        possible.push(possible);
                    } else{
                        maybe = possible;
                    }
                }

                if (product.owned === true) {
                    $rootScope.$broadcast(Config.SubscriptionPurchased);
                }
                else {
                    $rootScope.$broadcast(Config.SubscriptionExpired);
                }
                $rootScope.$broadcast(Config.ProductSetup);

            }

            return service;
        }]);
