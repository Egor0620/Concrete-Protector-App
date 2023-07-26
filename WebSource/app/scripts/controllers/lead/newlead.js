angular.module('estimateApp')
  .controller('NewLeadCtrl', ['$scope', '$stateParams', '$state', '$rootScope', 'Lead', 'Authorization', 'Reference', 'System', 'SystemDetail', 'Ingredient', '$window',
    function ($scope, $stateParams, $state, $rootScope, Lead, Authorization, Reference, System, SystemDetail, Ingredient, $window) {

      'use strict';

      function init() {

        $scope.LeadSystem = {};
        $scope.LeadSystems = [];
        $scope.Model = {};
        $scope.System = {};
        $scope.saving = false;

        $scope.IsInRoles = function (roles) {
          return Authorization.IsInRole(roles);
        };

        var searchType = {
          'type': 'use',
          'populate': ['systemdetail', 'ingredient']
        };
        System.GetAll(searchType)
          .then(function (result) {
            $scope.Systems = result;
          },
          function (error) {
            $scope.errors = error;
          }
        );

        Reference.States('us')
          .then(function (result) {
            $scope.States = result;
          }, function (error) {
            $scope.errors = error;
          });


        Reference.PhoneTypes()
          .then(function (result) {
            $scope.PhoneTypes = result;
          }, function (error) {
            $scope.errors = error;
          });

        Reference.AddressTypes()
          .then(function (result) {
            $scope.AddressTypes = result;
          }, function (error) {
            $scope.errors = error;
          });

        //

        var isAdmin = Authorization.IsInRole(['concreteprotector', 'subscriber', 'administrator']);



        $scope.BestTimeToCalLOptions = Lead.BestTimeToCalLOptions;

        $scope.AddSystem = function (model) {
          $scope.Model.errors = [];

          if (!model.areaname) {
            $scope.Model.errors.push('area name required');
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
          else {
            calculatePrice();
            model.System = angular.copy($scope.System);
          }

          var thisSystem = angular.copy(model);
          $scope.LeadSystems.push(thisSystem);
          $scope.LeadSystem = {};
          model = {};
          $scope.System = {};
          $scope.showIngredients = false;

        };

        $scope.UpdateSystem = function (model) {
          $scope.Model.errors = [];

          if (!model.areaname) {
            $scope.Model.errors.push('area name required');
            return;
          }

          model.System = angular.copy($scope.System);
          $scope.LeadSystems[$scope.LeadSystemPrimeIndex] = model;

          $scope.LeadSystem = {};
          $scope.System = {};
          $scope.LeadSystemPrime = {};
          $scope.LeadSystemEdit = false;
          $scope.showIngredients = false;
        };

        $scope.RemoveSystem = function (system, index) {
          var prompt ='Are you absolutely sure you want to remove this area:  ' + system.areaname + '?';
          function removeSystem(buttonIndex) {

            if (buttonIndex === 1) {

              if (system.id) {
                system.visible = false;
              }
              else {
                $scope.LeadSystems.splice(index, 1);
              }


              $scope.LeadSystem = {};
              $scope.System = {};
              $scope.LeadSystemPrime = {};
              $scope.LeadSystemEdit = false;
              $scope.showIngredients = false;
            }
          }
          if (navigator && navigator.notification) {
            navigator.notification.confirm(
              prompt,
              removeSystem,
              'Delete',
              ['Yes', 'No']
            );
          }
          else {
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
          $scope.LeadSystemEdit = true;

          $scope.showIngredients = false;
        };

        $scope.CancelUpdateSystem = function (leadSystem) {
          //leadSystem = angular.copy($scope.LeadSystemPrime);

          $scope.LeadSystemPrime = {};
          $scope.LeadSystem = {};
          $scope.System = {};
          $scope.LeadSystemEdit = false;
          $scope.showIngredients = false;
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

        function rehydrateDetails(system) {
          $scope.System = {};
          system.saleprice = Number(system.saleprice);
          $scope.System = system;
          calculatePrice();
        }

        $scope.AreaChanged = function () {
          calculatePrice();
        };

        function calculatePrice() {
          var systemLength = $scope.LeadSystem.length || 0;
          var systemwidth = $scope.LeadSystem.width || 0;
          var area = (systemLength * systemwidth).toFixed(2);

          var contractortotalprice = 0;
          _.each($scope.System.ingredients, function (ingredient) {
            var amount = ((area / ingredient.coverage) * ingredient.factor).toFixed(2);
            var contractorprice = amount * ingredient.purchaseprice;
            ingredient.contractorprice = contractorprice;
            ingredient.amount = amount;
            contractortotalprice += contractorprice;
          });
          var totalPrice = $scope.System.saleprice * area;
          $scope.System.coverage = area;
          $scope.System.price = totalPrice.toFixed(2);
          $scope.System.contractortotalprice = contractortotalprice.toFixed(2);
        }

        $scope.SaveLead = function (lead) {
          $scope.saving = true;
          //Lead.UpdateLead($stateParams.id, lead);
          var errors = [],
            theform = this.leadform;
          lead.Errors = [];

          validateLead(lead, errors);

          if (errors.length > 0) {
            lead.errors = errors;
            lead.error = errors.join(', ');
            $scope.saving = false;
            return lead.error;
          }

          lead.error = [];
          lead.errors = [];

          Lead.Add(lead)
            .then(function (result) {
              $scope.saving = false;
              $rootScope.back();
              //     $state.go('index');
              //$state.go('index.lead', {id: result.person.id});
            },
            function (error) {
              $scope.saving = false;
              lead.errors = error;
              lead.error = lead.errors.join(', ');

            }
          );
        };

        function validateLead(lead, errors) {

          if (!lead.firstname && !lead.lastname && !lead.company) {
            errors.push('first name, last name or company required');
          }

          lead.hasaddress = false;
          lead.hasphone = false;
          lead.hasdetail = false;

          if (lead.address1) {
            lead.hasaddress = true;
          }
          if (lead.address2) {
            lead.hasaddress = true;
          }
          if (lead.city) {
            lead.hasaddress = true;
          }
          if (lead.state) {
            lead.hasaddress = true;
          }
          if (lead.zip) {
            lead.hasaddress = true;
          }
          if (lead.addresstype) {
            lead.hasaddress = true;
          }

          if (lead.hasaddress) {
            lead.addresses = [];
            var newAddress = {
              address1: lead.address1,
              address2: lead.address2,
              city: lead.city,
              state: lead.state,
              zip: lead.zip,
              addresstype: lead.addresstype,
              primary: true
            };
            lead.addresses.push(newAddress);

            if (!lead.address1) {
              lead.address1 = '';
            }
            if (!lead.city) {
              lead.city = '';
            }

            if (!lead.state) {
              lead.state = 'OH';
            }

            if (!lead.zip) {
              lead.zip = '';
            }

            if (!lead.addresstype) {
              lead.addresstype = 'home';
            }

          }

          if (lead.number) {
            lead.hasphone = true;
          }
          if (lead.phonetype) {
            lead.hasphone = true;
          }
          if (lead.hasphone) {
            lead.phones = [];
            var newPhone = {
              number: lead.number,
              phonetype: lead.phonetype,
              primary: true
            };
            lead.phones.push(newPhone);
            if (!lead.number) {
              lead.number = '';
            }

            if (!lead.phonetype) {
              lead.phonetype = 'home';
            }

          }

          if (lead.email) {
            lead.hasdetail = true;
          }
          if (lead.besttimetocall) {
            lead.hasdetail = true;
          }
          if (lead.hearaboutus) {
            lead.hasdetail = true;
          }
          if (lead.howcanwehelp) {
            lead.hasdetail = true;
          }

          lead.Systems = $scope.LeadSystems;
          if (lead.note && lead.note.length > 490) {
            errors.push('note is too long');
          }


        }

        //
        $scope.Cancel = function () {
          $scope.saving = false;
          $rootScope.back();
        };

      }

      init();

    }]);
