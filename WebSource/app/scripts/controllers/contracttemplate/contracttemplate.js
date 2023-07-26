/**
 * @ngdoc function
 * @name estimateApp.controller:ContractTemplateLayoutCtrl
 * @description
 * # ContractTemplateLayoutCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
    .controller('ContractTemplateCtrl', [
        '$rootScope', '$state', '$scope', '$stateParams', 'ContractTemplate', '$cordovaCamera', 'Storage', '$q', 'Reference', 'Log', '$window','Config',function (
            $rootScope, $state, $scope, $stateParams, Service, $cordovaCamera, Storage, $q, Reference, Log,$window, Config) {
            'use strict';
            $scope.saving = false;

            function init() {

                $scope.Model = {
                    name: '',
                    type: '',
                    layout: '',
                    header: {id: 0, data: ''},
                    term: {id: 0, data: ''},
                    footer: {id: 0, data: ''}
                };
                $scope.HeaderModelPrime = {id: 0, data: ''};
                $scope.FooterModelPrime = {id: 0, data: ''};
                $scope.TermModelPrime = {id: 0, data: ''};

                var cameraOptions = {};
                if (navigator && navigator.camera) {
                    cameraOptions = {
                        quality: 40,
                        correctOrientation: true,
                        destinationType: Camera.DestinationType.DATA_URL,
                        //destinationType: Camera.DestinationType.FILE_URI,
                        encodingType: Camera.EncodingType.PNG,
                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY
                    };
                }

                $scope.Layouts = [];

                function get(id) {

                    var promises = [];
                    var headerhints = {
                        populate: true,
                        searchType: 'use',
                        storageType: 'contracttemplateheader'
                    };
                    var termhints = {
                        populate: true,
                        searchType: 'use',
                        storageType: 'contracttemplateterm'
                    };
                    var footerhints = {
                        populate: true,
                        searchType: 'use',
                        storageType: 'contracttemplatefooter'
                    };
                    var criteria = {fid: id};

                    // get contracttemplate
                    promises.push(Service.Get(id));

                    // get contracttemplateheader
                    promises.push(Storage.Search(criteria, headerhints));

                    // get contracttemplatefooter
                    promises.push(Storage.Search(criteria, footerhints));

                    // get contracttemplateterm
                    promises.push(Storage.Search(criteria, termhints));

                    $q.all(promises)
                        .then(function (promiseResults) {
                            populateContractTemplate(promiseResults[0][0]);
                            populateHeader(promiseResults[1][0]);
                            populateFooter(promiseResults[2][0]);
                            populateTerm(promiseResults[3][0]);
                        }, function (error) {
                            Reference.ProcessError(error, $scope.errors);
                        });
                }

                if ($stateParams.id) {
                    get($stateParams.id);
                }

                function populateContractTemplate(model) {
                    if (model) {
                        $scope.Model = model;

                        $scope.Model.header = {id: 0, data: ''};
                        $scope.Model.term = {id: 0, data: ''};
                        $scope.Model.footer = {id: 0, data: ''};
                    }
                }

                function populateHeader(model) {
                    if (model) {
                        $scope.Model.header = model;
                        $scope.HeaderModelPrime = angular.copy(model);
                    }
                }

                function populateFooter(model) {
                    if (model) {
                        $scope.Model.footer = model;
                        $scope.FooterModelPrime = angular.copy(model);
                    }
                }

                function populateTerm(model) {
                    if (model) {
                        $scope.Model.term = model;
                        $scope.TermModelPrime = angular.copy(model);
                    }
                }

                function getLayouts() {
                    var criteria = {},
                        hints = {};
                    hints.storageType = 'contracttemplatelayout';
                    hints.searchType = 'use';
                    Storage.Search(criteria, hints)
                        .then(function (layout) {
                            $scope.Layouts = layout;
                        }, function (error) {

                        });
                }

                getLayouts();

                $scope.Cancel = function () {
                    $rootScope.back();
                };

                $scope.Save = function (model) {
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

                    var saves = [];

                    if ($stateParams.id && ($stateParams.id).length > 10) {

                        Service.Update(model)
                            .then(function () {
                                saves.push(processStorage(model.id, saves, $scope.HeaderModelPrime, $scope.Model.header, 'contracttemplateheader'));
                                saves.push(processStorage(model.id, saves, $scope.FooterModelPrime, $scope.Model.footer, 'contracttemplatefooter'));
                                saves.push(processStorage(model.id, saves, $scope.TermModelPrime, $scope.Model.term, 'contracttemplateterm'));
                            },
                            function (error) {
                                model.errors = error;
                                model.error = model.errors.join(', ');
                                return;
                            }
                        );
                    }
                    else {
                        Service.Add(model)
                            .then(function () {
                                saves.push(processStorage(model.id, saves, $scope.HeaderModelPrime, $scope.Model.header, 'contracttemplateheader'));
                                saves.push(processStorage(model.id, saves, $scope.FooterModelPrime, $scope.Model.footer, 'contracttemplatefooter'));
                                saves.push(processStorage(model.id, saves, $scope.TermModelPrime, $scope.Model.term, 'contracttemplateterm'));
                            },
                            function (error) {
                                model.errors = error;
                                model.error = model.errors.join(', ');
                                return;
                            }
                        );
                    }

                    $q.all(saves)
                        .then(function (promiseResults) {
                            $rootScope.back();
                        }, function (error) {
                            Reference.ProcessError(error, $scope.errors);
                        });

                };

                function validate(model, errors) {

                    if (model.name === '') {
                        errors.push('missing name');
                    }

                    if (model.type === '') {
                        errors.push('missing print layout');
                    }

                    if (model.layoutid === '') {
                        errors.push('missing contract format');
                    }
                }

                function processStorage(fid, promises, prime, model, type) {

                    // if the prime data and the model data are the same then return
                    if (prime.data === model.data) {
                        return;
                    }

                    // no original data
                    if (prime.id === 0) {
                        // add
                        if (model.data !== '') {
                            model.type = type;
                            model.fid = fid;
                            promises.push(Storage.Add(model));
                        }
                    } else {
                        // update
                        if (prime.data !== model.data && model.data !== '') {
                            promises.push(Storage.Update(model));
                        }
                        // delete
                        if (prime.data !== model.data && model.data === '') {
                            promises.push(Storage.Remove(prime.id));
                        }
                    }
                }


                function fileTooLargeCallback(buttonIndex){

                }

                function fileTooLarge(fileLength) {

                    Log.Log('file too large ' + fileLength);
                    var prompt = 'The image that you chose is too large, please select an images that is less than 100KB in size.';

                    if(navigator && navigator.notification){
                        navigator.notification.alert(
                            prompt,
                            fileTooLargeCallback,
                            'File Too Large',
                            'Ok'
                        );
                    }
                    else{
                        var confirmDeleteSystem = $window.alert(prompt);
                    }


                }

                $scope.GetImage = function (model) {
                    $scope.errors = [];
                    if (navigator && navigator.camera) {
                        $cordovaCamera.getPicture(cameraOptions)
                            .then(function (imageData) {
                                //140000 max length
                                Log.Log('imageData length ' + imageData.length);

                                if (imageData.length > 150000) {
                                    fileTooLarge(imageData.length);
                                } else{
                                    model.data = imageData;
                                }

                            }, function (error) {
                                Reference.ProcessError(error, $scope.errors);
                            });
                    }
                };

                $scope.RemoveImage = function (model, property) {
                    property.id = 0;
                    property.data = '';
                };

            }

            init();

            $rootScope.$on(Config.AjaxActivity, function (event, data) {
                $scope.saving = data;
            });
        }]);
