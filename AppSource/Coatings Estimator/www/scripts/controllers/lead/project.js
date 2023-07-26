angular.module('estimateApp')
  .controller('ProjectCtrl', [
    '$window', '$scope', '$state', '$stateParams', '$ionicPopup', '$q', '$rootScope', 'Lead', 'Project', 'ProjectDetail', 'Config', 'System', 'ProjectDetailStyle', 'Storage', 'Person', 'Reference', 'Note','Address','$cordovaCamera','$filter',
    function ($window, $scope, $state, $stateParams, $ionicPopup, $q, $rootScope, Lead, Project, ProjectDetail, Config, System, ProjectDetailStyle, Storage, Person, Reference, Note, Address, $cordovaCamera, $filter) {

      'use strict';

      function init() {
        $scope.projectid = $stateParams.projectid;
        $rootScope.leadid = $scope.leadid = $stateParams.leadid;
        $scope.AreaImages = [];
        $scope.AreaImage = {};
        $scope.Signature = {};
        $scope.showIngredients = true;
        $scope.saving = false;

        $scope.isNew = true;
        if ($scope.projectid && $scope.projectid.length === 36) {
          $scope.isNew = false;
        }

        if ($scope.isNew === true) {
          $rootScope.$broadcast(Config.SetTitleEvent, 'New Estimate');
        }

        var promises = [];
        var hints = {
          searchType: 'use',
          populate: true
        };
        var searchType = {
          'type': 'use',
          'populate': ['systemdetail', 'ingredient']
        };
        promises.push(Lead.Get($scope.leadid, hints));
        promises.push(System.GetAll(searchType));
        var addresscriteria = [{'personid': $scope.leadid}];

        promises.push(Address.Search(addresscriteria));
        if ($scope.isNew === false) {
          promises.push(Project.Search([{id: $scope.projectid}]));
        }

        $q.all(promises)
          .then(function (promiseResults) {
            populateLead(promiseResults[0][0]);
            $scope.Systems = promiseResults[1];
            $scope.Addresses = promiseResults[2];
            if (promiseResults.length > 3) {
              populateProject(promiseResults[3][0]);
            }
            else {
              populateProject({
                leadid: $scope.Lead.id
              });
            }
          }, function (error) {
            $scope.errors = error;
          });

        function populateLead(model) {
          $scope.Lead = model;
        }

        function ensureProject(project){
          var response = $q.defer();
          if (project.id && project.id.length === 36) {
            response.resolve(project);
          }
          else{
            saveProject(project)
              .then(function(result){
                return response.resolve(result);
              }, function(error){
               response.reject(error);
            });
          }
          return response.promise;
        }

        // needed a promise to determine if the project exists
        function saveProject(project) {
          var response = $q.defer();
          if (project.id && project.id.length === 36) {
            Project.Update(project)
              .then(function (newProject) {
                $scope.isNew = false;
                $scope.projectid = newProject.id;
                $scope.Model = newProject;

                if (newProject.designconsult) {
                  $scope.Model.designconsult = new Date(newProject.designconsult);
                }
                if (newProject.install) {
                  $scope.Model.install = new Date(newProject.install);
                }
                if (newProject.completed) {
                  $scope.Model.completed = new Date(newProject.completed);
                }
                return response.resolve(newProject);
              }, function (error) {
                return response.reject(error);
              });
          }
          else {
            Project.Add(project)
              .then(function (newProject) {
                $scope.isNew = false;
                $scope.projectid = newProject.id;
                $scope.Model = newProject;
                if (newProject.designconsult) {
                  $scope.Model.designconsult = new Date(newProject.designconsult);
                }
                if (newProject.install) {
                  $scope.Model.install = new Date(newProject.install);
                }
                if (newProject.completed) {
                  $scope.Model.completed = new Date(newProject.completed);
                }
                return response.resolve(newProject);
              }, function (error) {
                return response.reject(error);
              });
          }

          return response.promise;
        }

        // needed a promise to determine if the project exists
        function saveProjectDetail(projectDetail) {
          var response = $q.defer();
          if (projectDetail.id && projectDetail.id.length === 36) {
            ProjectDetail.Update(projectDetail)
              .then(function (result) {
                $scope.LeadSystem = result;
                $scope.saving = false;
                return response.resolve(result);
              }, function (error) {
                $scope.saving = false;
                return response.reject(error);
              });

          }
          else {
            ensureProject($scope.Model)
              .then(function (project) {
                projectDetail.projectid = project.id;
                projectDetail.saleprice = $scope.System.saleprice;
                ProjectDetail.Add(projectDetail)
                  .then(function (result) {
                    $scope.saving = false;
                    $scope.LeadSystem = result;
                    return response.resolve(result);
                  }, function (error) {
                    $scope.saving = false;
                    return response.reject(error);
                  });

              }, function (error) {
                return response.reject(error);
              });
          }
          return response.promise;
        }

        function getProject() {
          Project.Search([{id: $scope.projectid}])
            .then(function (project) {
              populateProject(project[0]);
            },
            function (error) {
              $scope.LeadSystem.errors.push(error);
            });
        }

        function populateNotes(model){
          $scope.Notes = model;
        }

        function populateProject(model) {
          if (model.designconsult) {
            model.designconsult = new Date(model.designconsult);
            model.designconsult = $filter('date')(model.designconsult,'MM/dd/yyyy');
          }
          if (model.install) {
            model.install = new Date(model.install);
            model.install = $filter('date')(model.install,'MM/dd/yyyy');
          }
          if (model.completed) {
            model.completed = new Date(model.completed);
            model.completed = $filter('date')(model.completed,'MM/dd/yyyy');
          }

          $scope.Model = model;

          $scope.ModelPrime = {};
          meshProjectSystem();
          $scope.manageSystem = false;
          $scope.showIngredients = false;
          $scope.showAreaPrice = false;

          populateNotes(model.notes);
        };

        $scope.updatePrice = function(detail) {
          var price = parseFloat(detail.contractorprice).toFixed(2);

          detail.style.contractorprice = detail.contractorprice = price;

          calculatePrice();
        };


        $scope.Cancel = function () {
          $scope.saving = false;
          $rootScope.back();
        };

        // Lead
        $scope.EditLead = function (model) {
          $scope.ModelPrime = angular.copy($scope.Model);
          $scope.LeadPrime = angular.copy($scope.Lead);
          $scope.Model.install = $filter('date')($scope.Model.install,'MM/dd/yyyy');
          $scope.Model.completed = $filter('date')($scope.Model.completed,'MM/dd/yyyy');
          $scope.Model.designconsult = $filter('date')($scope.Model.designconsult,'MM/dd/yyyy');
          $scope.manageLead = true;
        };

        $scope.CancelLeadUpdate = function (model) {
          $scope.Model = angular.copy($scope.ModelPrime);
          $scope.Lead = angular.copy($scope.LeadPrime);
          $scope.manageLead = false;
        };

        $scope.SaveLead = function (model) {
          $scope.Model.errors = [];
          $scope.saving = true;
          var savePerson = false;
          if (savePerson === false && $scope.LeadPrime.person.firstname !== $scope.Lead.person.firstname) {
            savePerson = true;
          }

          if (savePerson === false && $scope.LeadPrime.person.lastname !== $scope.Lead.person.lastname) {
            savePerson = true;
          }

          if (savePerson === false && $scope.LeadPrime.person.company !== $scope.Lead.person.company) {
            savePerson = true;
          }

          var saves = [];

          saves.push(saveProject(model));
          saves.push(Person.Update($scope.Lead.person));

          $q.all(saves)
            .then(function (success) {
              if (saves.length > 0) {
                $scope.saving = false;
                $scope.Lead.person = success[1];
              }
            },
            function (error) {
              $scope.saving = false;
              $scope.Model.errors.push(error);
            });

          $scope.manageLead = false;
        };

        // End Lead

        // Systems

        $scope.NewSystem = function () {
          $scope.LeadSystemPrime = {};
          $scope.LeadSystem = {};
          $scope.System = {};
          rehydrateDetails($scope.LeadSystem.System);
          $scope.manageSystem = true;
        };

        $scope.CancelUpdateSystem = function () {
          //  leadSystem = angular.copy($scope.LeadSystemPrime);
          $scope.saving = false;
          $scope.LeadSystemPrime = {};
          $scope.LeadSystem = {};
          $scope.System = {};
          $scope.manageSystem = false;
          $scope.showIngredients = false;
          $scope.showAreaPrice = false;
        };

        function buildProjectDetail(projectDetail) {

          var isNew = false;
          if (!projectDetail.id) {
            isNew = true;
            projectDetail.projectid = $scope.projectid;
          }
          var system = $scope.System,
            originalModel = $scope.LeadSystemPrime,
            addonly = false,
            updateStyles = [],
            newStyles = [],
            deleates = [];

          if (projectDetail.systemid !== originalModel.systemid) {
            addonly = true;
            // remove all styles, because we can't update them
            if (originalModel.styles && originalModel.styles.length > 0) {
              _.each(originalModel.styles, function (style) {
                deleates.push(style.id);
              });
            }
          }

          projectDetail.systemid = system.id;
          projectDetail.saleprice = System.saleprice;
          projectDetail.area = system.coverage;
          projectDetail.saleprice = system.saleprice;

          saveProjectDetail(projectDetail)
            .then(function (result) {

              _.each(system.ingredients, function (ingredient) {
                buildProjectStyle(addonly, ingredient, result, newStyles, updateStyles);
              });
              saveStyles(newStyles, deleates, updateStyles);
              $scope.saving = false;
            }, function (error) {
              $scope.saving = false;
              Reference.ProcessError(error, $scope.LeadSystem.errors);
            });


        }

        function buildProjectStyle(addonly, ingredient, model, adds, updates) {
          var style = {};

          if (addonly) {
            if (ingredient.style) {
              style = ingredient.style;
            }
            style.projectdetailid = model.id;
            style.ingredientid = ingredient.id;
            style.purchaseprice = ingredient.purchaseprice;
            style.contractorprice = ingredient.contractorprice;
            adds.push(style);
          }
          else {
            if (ingredient.style.id) {
              style = ingredient.style;
              style.ingredientid = ingredient.id;
              style.contractorprice = ingredient.contractorprice;
              updates.push(style);
            }
            else {
              if (ingredient.style) {
                style = ingredient.style;
              }
              style.projectdetailid = model.id;
              style.ingredientid = ingredient.id;
              style.purchaseprice = ingredient.purchaseprice;
              style.contractorprice = ingredient.contractorprice;
              adds.push(style);
            }
          }
        }

        function saveStyles(newStyles, deleates, updateStyles) {
          var response = $q.promise;
          var saves = [];

          _.each(deleates, function (thisItem) {
            saves.push(ProjectDetailStyle.Remove(thisItem));
          });
          _.each(newStyles, function (style) {
            saves.push(ProjectDetailStyle.Add(style));
          });
          _.each(updateStyles, function (style) {
            saves.push(ProjectDetailStyle.Update(style));
          });

          //save the adds
          $q.all(saves)
            .then(function () {
              getProject();
            }, function (error) {
              $scope.LeadSystem.errors.push(error);
            });
        }

        $scope.SaveSystem = function (model) {
          $scope.LeadSystem.errors = [];
          $scope.saving = true;
          if (!model.name) {
            $scope.LeadSystem.errors.push('area name required');
            $scope.saving = false;
            return;
          }
          if (!model.length) {
            model.length = 0;
          }
          if (!model.width) {
            model.width = 0;
          }
          if (!model.systemid) {
            model.systemid = $scope.Systems[0].id;
            calculatePrice();
            model.System = angular.copy($scope.Systems[0]);
          }


          buildProjectDetail(model);

        };

        $scope.UpdateSystem = function (model) {
          $scope.LeadSystem.errors = [];

          if (!model.areaname) {
            $scope.LeadSystem.errors.push('area name required');
            return;
          }

          model.System = angular.copy($scope.System);
          $scope.LeadSystems[$scope.LeadSystemPrimeIndex] = model;

          $scope.LeadSystem = {};
          $scope.System = {};
          $scope.LeadSystemPrime = {};
          $scope.manageSystem = false;
          $scope.showIngredients = false;
          $scope.showAreaPrice = false;
        };

        $scope.RemoveSystem = function (system, index) {

          var prompt = 'Are you absolutely sure you want to remove this area:  ' + system.areaname + '?';

          function removeSystem(buttonIndex){

              if(buttonIndex === 1){

                if (system.id) {
                  system.visible = false;
                }
                else {
                  $scope.LeadSystems.splice(index, 1);
                }
                $scope.LeadSystem = {};
                $scope.System = {};
                $scope.LeadSystemPrime = {};
                $scope.manageSystem = false;
                $scope.showIngredients = false;
                $scope.showAreaPrice = false;
              }
          }

          if(navigator && navigator.notification){
            navigator.notification.confirm(
              prompt,
              removeSystem,
              'Delete Area',
              ['Yes','No']
            );
          }
          else{
            var confirmDeleteSystem = $window.confirm(prompt);
            if (confirmDeleteSystem) {
             removeSystem(1);
            }
          }
        };

        $scope.EditSystem = function (model, index) {
          $scope.LeadSystem = {};
          $scope.System = {};

          $scope.LeadSystemPrime = model;
          $scope.LeadSystemPrimeIndex = index;

          $scope.LeadSystem = angular.copy(model);
          rehydrateDetails($scope.LeadSystem.System);
          $scope.manageSystem = true;

        };

        $scope.SystemChange = function (id) {
          populateDetails(id);
        };

        function populateDetails(id) {
          $scope.System = {};
          if (!id) {
            return;
          }
          var system = _.where($scope.Systems, {'id': id})[0];
          system.saleprice = Number(system.saleprice);

          $scope.System = system;
          calculatePrice();
        }

        function meshProjectSystem() {
          _.each($scope.Model.details, function (detail) {
            detail.System = _.where($scope.Systems, {id: detail.systemid})[0];
            if(detail.System){
              detail.System.saleprice = Number(detail.saleprice);
            }

          });
          if ($scope.Model.saleprice) {
            $scope.Sytem.saleprice = $scope.Model.saleprice;
          }

          $scope.LeadSystems = $scope.Model.details;

        }

        function rehydrateDetails(system) {
          $scope.System = {};
          if (!system) {
            return;
          }
          _.each(system.ingredients, function (ingredient) {

            var style = _.where($scope.LeadSystem.styles, {ingredientid: ingredient.id})[0];

            ingredient.style = _.where($scope.LeadSystem.styles, {ingredientid: ingredient.id})[0];

          });
          $scope.System = system;
          calculatePrice();
        }

        $scope.AreaChanged = function () {
          calculatePrice();
        };

        function calculatePrice() {
          var systemLength = $scope.LeadSystem.arealength || 0;
          var systemwidth = $scope.LeadSystem.areawidth || 0;
          var area = (systemLength * systemwidth).toFixed(2);

          var contractortotalprice = 0;
          _.each($scope.System.ingredients, function (ingredient) {
            var amount = ((area / ingredient.coverage) * ingredient.factor).toFixed(2);
            var contractorprice = amount * ingredient.purchaseprice;

            try {
              if (ingredient.style.contractorprice)
                contractorprice = ingredient.style.contractorprice;
            }
            catch(e) {

            }


            ingredient.contractorprice = parseFloat(contractorprice).toFixed(2);
            ingredient.amount = amount;
            contractortotalprice += parseFloat(contractorprice);
          });
          var totalPrice = $scope.System.saleprice * area;
          $scope.System.coverage = area;
          $scope.System.price = totalPrice.toFixed(2);
          $scope.System.contractortotalprice = parseFloat(contractortotalprice).toFixed(2);
        }

        // Systems

        // Images & Signatues

        function populateStorages(storageModels) {
          var queues = [],
          response = $q.defer(),
            results =  _.where(storageModels, {type: 'areaimage'});

         // $scope.AreaImages = _.where(storageModels, {type: 'areaimage'});

          _.each(results, function(image){
            //populateImage(image);
            queues.push(Storage.GetFileImageString(image.id));
          });

          $q.all(queues)
            .then(function(images){
              _.each(results, function(image, i){
                image.data = images[i];
              });
             return  response.resolve(results);

            },
          function(error){
            return response.reject(error);
          });
          return response.promise;
          /*
          $scope.Signature = _.where(storageModels, {type: 'signature'})[0];

          if ($scope.Signature && $scope.Signature.id.length === 36) {
            populateImage($scope.Signature);
          }*/

        }

        function populateImage(storage) {
          Storage.GetFileImageString(storage.id)
            .then(function (data) {
              storage.data = data;
            }, function (error) {
              $scope.errors = error;
            });
        }

        $scope.RemoveAreaImage = function (model, index) {

          function removeImage(buttonIndex){
            if(buttonIndex === 1){
              if (model.id) {
                Storage.Remove(model.id)
                  .then(function (success) {
                    $scope.AreaImages.splice(index, 1);
                  }, function (error) {
                    // TODO: write a better error message
                    $window.alert(error);
                  });
              }
            }
          }

          if(navigator && navigator.notification){
            navigator.notification.confirm(
              'Are you absolutely sure you want to remove this image?', // message
              removeImage,// callback to invoke with index of button pressed
              'Delete Image',           // title
              ['Yes','No']         // buttonLabels
            );
          }
          else{
            var confirmRemoveImage = $window.confirm('Are you absolutely sure you want to remove this image?');

            if (confirmRemoveImage) {
              removeImage(1);

            }
          }


        };

        $scope.TakePicture = function () {
          $scope.AreaImage = {};
          $scope.AreaImage.errors = [];

          if (navigator && navigator.camera) {
            var cameraOptions = {
              quality: 30,
              destinationType: Camera.DestinationType.DATA_URL,
              encodingType: Camera.EncodingType.PNG,
              correctOrientation: true,
              targetWidth: 800,
              targetHeight: 600
            };

            $cordovaCamera.getPicture(cameraOptions)
              .then(function(imageData) {
              //  $scope.AreaImage.data = 'data:image/png;base64,' + imageData;
                var newImage = {
                  'data':imageData // 'data:image/png;base64,' + imageData
                };
                populateCameraResult(newImage);
              }, function(error) {
                Reference.ProcessError(error, $scope.AreaImage.errors);
            });

          }
        };

        $scope.$watch('showImages', function(oldVal, newVal) {
          if (oldVal === true && newVal === undefined)
          {
            populateImageData();
          }

        });

        function populateImageData(){
          if($scope.AreaImages.length === 0){
            Storage.Search([{fid: $scope.projectid}])
              .then(function (storages) {
                populateStorages(storages)
                  .then(function(results){
                    $scope.AreaImages = results;
                  },
                  function(error){
                    Reference.ProcessError(error, $scope.errors);
                  });
              }, function (error) {
                Reference.ProcessError(error, $scope.errors);
              });
          }
        }

        function populateCameraResult(newImage){
          $scope.NewPicture = true;
          $scope.AreaImage = newImage;
        }

        $scope.SaveAreaImage = function () {
          $scope.saving = true;
          $scope.AreaImage.errors = [];
          if (!$scope.projectid) {
            ensureProject($scope.Model)
              .then(function (project) {
                var storageModel = {};
                storageModel.type = 'areaimage';
                storageModel.data = $scope.AreaImage.data;
                storageModel.fid = project.id;
                Storage.Add(storageModel)
                  .then(function (success) {
                    $scope.saving = false;
                    success.data = $scope.AreaImage.data;
                    $scope.AreaImages.push(success);
                    $scope.AreaImage = {};
                  }, function (error) {
                    $scope.saving = false;
                    $scope.AreaImage.errors.push(error);
                  });
              }, function (error) {
                $scope.saving = false;
                $scope.AreaImage.errors.push(error);
              });
          }
          else {
            var storageModel = {};
            storageModel.type = 'areaimage';
            storageModel.data = $scope.AreaImage.data;
            storageModel.fid = $scope.projectid;
            Storage.Add(storageModel)
              .then(function (success) {
                $scope.saving = false;
                success.data = $scope.AreaImage.data;
                $scope.AreaImage = {};
                $scope.AreaImages.push(success);
              }, function (error) {
                $scope.saving = false;
                $scope.AreaImage.errors.push(error);
              });
          }
          $scope.NewPicture = false;
        };

        $scope.CancelSaveAreaImage = function () {
          $scope.saving = false;
          $scope.NewPicture = false;
          $scope.AreaImage = {};
        };

        $scope.SaveSignature = function (model) {
          $scope.saving = true;
          $scope.Signature.errors = [];

          if (!model.data || model.data.length === 0) {
            $scope.Signature.errors.push('signature missing');
            return;
          }


          if (!$scope.projectid) {
            ensureProject($scope.Model)
              .then(function (project) {
                var storageModel = {};
                storageModel.type = 'signature';
                storageModel.data = model.data;
                storageModel.fid = project.id;
                storageModel.filename = 'signature';
                Storage.Add(storageModel)
                  .then(function (success) {
                    $scope.saving = false;
                    success.data = null;
                    success.datadisplay = 'data:' + model.data;
                    $scope.Signature = success;
                    $scope.editSignature = false;
                  }, function (error) {
                    $scope.saving = false;
                    $scope.Signature.errors.push(error);
                  });


              }, function (error) {
                $scope.saving = false;
                $scope.Signature.errors.push(error);
              });
          }
          else {
            if ($scope.Signature.id && $scope.Signature.id.length === 36) {
              Storage.Update(model)
                .then(function (success) {
                  $scope.saving = false;
                  success.datadisplay = 'data:' + model.data;
                  success.data = null;
                  $scope.Signature = success;
                  $scope.editSignature = false;
                }, function (error) {
                  $scope.saving = false;
                  $scope.Signature.errors.push(error);
                });
            }
            else {
              var storageModel = {};
              storageModel.type = 'signature';
              storageModel.data = model.data;
              storageModel.fid = $scope.projectid;
              storageModel.filename = 'signature';
              Storage.Add(storageModel)
                .then(function (success) {
                  $scope.saving = false;
                  success.data = null;
                  success.datadisplay = 'data:' + model.data;
                  $scope.Signature = success;
                  $scope.editSignature = false;
                }, function (error) {
                  $scope.saving = false;
                  $scope.Signature.errors.push(error);
                });
            }
          }
        };

        $scope.CancelSaveSignature = function (model) {
          $scope.saving = false;
          $scope.Signature = angular.copy($scope.SignaturePrime);
          $scope.editSignature = false;
        };

        $scope.EditSignature = function () {
          $scope.saving = false;
          $scope.SignaturePrime = angular.copy($scope.Signature);
          $scope.editSignature = true;
        };

        $scope.ProjectStatuses = Reference.ProjectStatuses;

        $scope.gotoContractPage = function() {
          if (!$rootScope.paid) {
            $rootScope.back();

            var alertPopup = $ionicPopup.alert({
              title: 'Paid version required!',
              template: 'Please purchase this app for contract function.'
            });

            alertPopup.then(function(res) {
              $state.go('index.purchase');
            });

            return;
          }
          else {
            $state.go('index.newcontract', {leadid:$scope.leadid, projectid:$scope.projectid});
          }
        }

        $scope.SaveNote = function (model) {
          $scope.saving = true;

          if (!model || !model.note) {
            $scope.saving = false;
            return;
          }
          $scope.saving = false;
          ensureProject($scope.Model)
            .then(function (project) {
              var newNote = {
                fid: project.id,
                body: model.note
              };

              Note.Add(newNote)
                .then(function(success){
                  $scope.saving = false;
                  $scope.saving = false;
                  //Model.notes
                  Note.Search([{'fid': project.id}])
                    .then(function(notes){
                      populateNotes(notes);
                      $scope.NewNote = {};
                    });

                }, function(error){
                  $scope.saving = false;
                  Reference.ProcessError(error, $scope.errors);
                });
            }, function(error){
              $scope.saving = false;
              Reference.ProcessError(error, $scope.errors);
          });
        };
      }

      init();
    }]);
