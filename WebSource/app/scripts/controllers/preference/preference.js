/**
 * @ngdoc function
 * @name estimateApp.controller:PreferenceSystemCtrl
 * @description
 * # PreferenceSystemCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
    .controller('PreferenceCtrl', ['$q', '$rootScope', '$state', '$scope', '$stateParams', 'Ignore','ignores','Config', 'helper',
        function ($q, $rootScope, $state, $scope, $stateParams, Ignore, ignores, Config, helper) {
            'use strict';
            $scope.saving = false;

            function init() {

                $scope.ignores = ignores;
                $scope.helper= helper;

                $scope.Cancel = function () {
                    $rootScope.back();
                };

                $scope.Save = function () {
                    var actions = buildSaveIgnores();
                    $q.all(actions)
                        .then(function (data) {
                            $rootScope.back();
                        }, function (err) {
                            $rootScope.back();
                        });
                };

                $scope.checkIgnore = function(ignore){
                    ignore.checked = !ignore.checked;

                    if(ignore.primeId === 0){
                        if(ignore.checked){
                            ignore.action = 'add';
                        } else {
                            ignore.action = '';
                        }
                    } else{
                        if(ignore.checked){
                            ignore.action = '';
                        } else {
                            ignore.action = 'remove';
                        }
                    }
                };

                function buildSaveIgnores() {
                    var innerResponse = [],
                        i = 0;
                    _.each(ignores, function (ignore) {
                        i = i + 1;
                        if(ignore.action){

                            if(ignore.action ==='add'){
                                var newIgnore = {
                                    fid : ignore.fid,
                                    type: ignore.type
                                };
                                innerResponse.push(Ignore.Add(newIgnore));
                            }
                            if(ignore.action ==='remove'){
                                innerResponse.push(Ignore.Remove(ignore.id));
                            }
                        }
                    });
                    return innerResponse;
                }

            }

            init();

            $rootScope.$on(Config.AjaxActivity, function (event, data) {
                $scope.saving = data;
            });
        }]);