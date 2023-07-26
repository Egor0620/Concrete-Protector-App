/**
 * @ngdoc function
 * @name estimateApp.controller:ContractTemplateLayoutCtrl
 * @description
 * # ContractTemplateLayoutCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
    .controller('ContractTemplateCtrl', [
        '$rootScope', '$state', '$scope', '$stateParams', 'ContractTemplate', 'Storage', '$q', 'Reference', 'Log', '$window','Config', '$cordovaCamera', 'uiHelper', function (
            $rootScope, $state, $scope, $stateParams, Service, Storage, $q, Reference, Log,$window, Config, $cordovaCamera, uiHelper) {
            'use strict';
            $scope.saving = false;

      window.setHeader = function(data) {
        $scope.Model.header.data = data;
      };

      window.setFooter = function(data) {
        $scope.Model.footer.data = data;
      };

            function init() {
              $scope.IsNew = true;

                $scope.Model = {
                    header: {id: 0, data: ''},
                    term:{}
                };

                $scope.HeaderModelPrime = {id: 0, data: ''};
                $scope.FooterModelPrime = {id: 0, data: ''};
                $scope.TermModelPrime = {id: 0, data: ''};

                $scope.cameraOptions = {};
                $scope.cameraOptionsFromLibrary = {};

                var icons = {
                    header: "ui-icon-circle-arrow-e",
                    activeHeader: "ui-icon-circle-arrow-s"
                };

                $('.contract').accordion({
                    icons: icons,
                    collapsible: true,
                    heightStyle: "content",
                    active: false
                });

                if (navigator && navigator.camera) {
                  $scope.cameraOptions = {
                    quality: 30,
                    destinationType: Camera.DestinationType.DATA_URL,
                    encodingType: Camera.EncodingType.PNG,
                    correctOrientation: false,
                    targetWidth: 800,
                    targetHeight: 600
                  };
                  $scope.cameraOptionsFromLibrary = {
                    quality: 30,
                    correctOrientation: false,
                    destinationType: Camera.DestinationType.DATA_URL,
                    //destinationType: Camera.DestinationType.FILE_URI,
                    encodingType: Camera.EncodingType.PNG,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
                  };

                }

                $scope.Layouts = [];

                function get(id) {
                  $scope.IsNew = false;

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

                    var criteria = [];
                    criteria.push({fid: id});

                    // get contracttemplate
                    promises.push(Service.Get(id));

                    // get contracttemplateheader
                    //promises.push(Storage.Search(criteria, headerhints));

                    // get contracttemplatefooter
                    //promises.push(Storage.Search(criteria, footerhints));

                    // get contracttemplateterm
                    //promises.push(Storage.Search(criteria, termhints));

                    $q.all(promises)
                        .then(function (promiseResults) {
                            var ret = promiseResults[0][0];
                            $scope.Model = ret;
                            $scope.Model.header = $scope.Model.headerImgSize == 0 ? {id:0, data: ""} : {id:0, data:Config.WebStorageEndpoint + ret.headerid + ".png"};

                            var term = {};

                            try {
                                term = JSON.parse(ret.term);
                            } catch (e) {
                                console.warn(e);
                            }


                            $scope.Model.term = term;
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
                    model = {data:"This is term."};

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

              $scope.Remove = function(id) {
                Service.Remove(id)
                  .then(function (result) {
                    $scope.saving = false;
                    uiHelper.showNoty('Template has been removed successfully.');
                    $rootScope.back();
                  },
                  function (error) {
                    uiHelper.showNoty('Template has not been removed due to these error :' + model.error, 'error');
                    $scope.saving = false;
                    Reference.ProcessError(error, model.errors);
                  });
              }

                $scope.Save = function (model) {
                    if (typeof(model.name) == 'undefined' || model.name == '') {
                        uiHelper.showNoty("Please input template name correctly.", "error");
                        return;
                    }

                    model.term.data = JSON.stringify(model.term);


                    if ($stateParams.id && ($stateParams.id).length > 10) {
                        Service.Update(model)
                            .then(function () {
                                model.errors = [];

                                uiHelper.showNoty('Template has been saved successfully.');
                                $rootScope.back();
                            },
                            function (error) {
                                model.errors = error;
                                model.error = model.errors.join(', ');

                                uiHelper.showNoty('Template has not been saved due to these error :' + model.error, 'error');
                                return;
                            }
                        );
                    }
                    else {
                        Service.Add(model)
                            .then(function () {
                                uiHelper.showNoty('Template has been saved successfully.');
                                $rootScope.back();
                                //saves.push(processStorage(model.id, saves, $scope.HeaderModelPrime, $scope.Model.header, 'contracttemplateheader'));
                                //saves.push(processStorage(model.id, saves, $scope.FooterModelPrime, $scope.Model.footer, 'contracttemplatefooter'));
                                //saves.push(processStorage(model.id, saves, $scope.TermModelPrime, $scope.Model.term, 'contracttemplateterm'));
                            },
                            function (error) {
                              uiHelper.showNoty('Template has not been saved due to these error :' + model.error, 'error');
                                model.errors = error;
                                model.error = model.errors.join(', ');
                                return;
                            }
                        );
                    }
                    /*
                    $q.all(saves)
                        .then(function (promiseResults) {
                          $rootScope.back();
                        }, function (error) {
                            Reference.ProcessError(error, $scope.errors);
                        });
                     */

                };

              function guid() {
                function s4() {
                  return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                  s4() + '-' + s4() + s4() + s4();
              }

                function validate(model, errors) {
                  model.type = "portrait";
                  model.layoutid = guid();

                    if (model.name === '')      errors.push('missing name');
                    if (model.type === '')      errors.push('missing print layout');
                    if (model.layoutid === '')  errors.push('missing contract format');
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

                $scope.GetImage = function (model, mode) {
                    $scope.errors = [];

                    var option = (mode == 0) ? $scope.cameraOptions : $scope.cameraOptionsFromLibrary;



                    if ($cordovaCamera.getPicture) {
                        $cordovaCamera.getPicture(option)
                            .then(function (imageData) {
                                //140000 max length
                                Log.Log('imageData length ' + imageData.length);

                                if (imageData.length > 1500000) {
                                    fileTooLarge(imageData.length);
                                } else{
                                    model.data = "data:image/png;base64," + imageData;
                                }

                            }, function (error) {
                                Reference.ProcessError(error, $scope.errors);
                            });
                    }
                    else {

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
