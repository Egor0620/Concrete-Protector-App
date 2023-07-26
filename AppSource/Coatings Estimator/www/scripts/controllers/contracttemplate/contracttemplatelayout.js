/**
 * @ngdoc function
 * @name estimateApp.controller:ContractTemplateLayoutCtrl
 * @description
 * # ContractTemplateLayoutCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
    .controller('ContractTemplateLayoutCtrl', [
        '$rootScope', '$state', '$scope', '$stateParams', 'Storage','uuid4', function (
            $rootScope, $state, $scope, $stateParams, Service, uuid4) {
        'use strict';
        function init() {
            $scope.saving = false;
            $scope.Model = {
                name: ''
            };

            function get(id) {
                $scope.saving = true;
                var hints = {
                        searchType : 'use',
                        populate : true, // this will get the data from the blob storage
                        storageType: 'contracttemplatelayout'
                    },
                    criteria = [];
                criteria.push({'id': id});

                //Service.Get(id)
                Service.Search(criteria, hints)
                    .then(function (result) {
                        if (result[0]) {
                            $scope.Model = result[0];
                            $scope.saving = false;
                        }
                    },
                    function (error) {
                        $scope.errors = error;
                        $scope.saving = false;
                    }
                );
            }

            if ($stateParams.id) {
                get($stateParams.id);
            }

            $scope.Cancel = function () {
                $rootScope.back();
            };

            $scope.Save = function (model) {
                $scope.saving = true;
                var errors = [];
                model.errors = [];
                validate(model, errors);

                if (errors.length > 0) {
                    model.errors = errors;
                    model.error = errors.join(', ');
                    return model.error;
                }

                model.error = [];
                model.errors = [];

                if ($stateParams.id && ($stateParams.id).length > 10) {

                    Service.Update(model)
                        .then(function () {
                            $scope.saving = false;
                            $rootScope.back();
                        },
                        function (error) {
                            $scope.saving = false;
                            model.errors = error;
                            model.error = model.errors.join(', ');

                        }
                    );

                }
                else {
                    model.type = 'contracttemplatelayout';
                    model.fid = uuid4.generate();
                    Service.Add(model)
                        .then(function () {
                            $scope.saving = false;
                            $rootScope.back();
                        },
                        function (error) {
                            $scope.saving = false;
                            model.errors = error;
                            model.error = model.errors.join(', ');

                        }
                    );
                }

            };

            function validate(model, errors) {

                if (model.filename === '') {
                    errors.push('missing name');
                }

                if (model.data === '') {
                    errors.push('missing layout');
                }

            }

        }

        init();
    }]);
