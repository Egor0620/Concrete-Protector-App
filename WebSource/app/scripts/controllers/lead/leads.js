angular.module('estimateApp')
  .controller('LeadsCtrl',
            ['$scope', '$stateParams', '$state','$rootScope', 'Lead', 'Config','Authorization',
    function ($scope, $stateParams, $state, $rootScope, Lead, Config, Authorization) {

      'use strict';

      function init() {

        $scope.moreThanAUser=false;
        $scope.DisableAddLead = false;
        if (Authorization.IsInRole(['concreteprotector', 'subscriber', 'administrator'])) {
          $scope.moreThanAUser = true;
        }

        var status = '1';
        if ($stateParams.status) {
          status = $stateParams.status;
        }

        if (status === '1') {
          $rootScope.$broadcast(Config.SetTitleEvent, 'Active Leads');
        } else if (status === '0') {
          $rootScope.$broadcast(Config.SetTitleEvent, 'Inactive Leads');
        }

        var hints = {
          searchType: 'use',
          populate: true,
          status: status
        };
        $scope.Leads = [];
        Lead.GetAll(hints)
          .then(function (result) {
            if($scope.moreThanAUser === false && result.length > 9){
              $scope.DisableAddLead = true;
            }

            _.each(result, function (lead) {
              if (!lead.phone) {
                lead.phone = {
                  number: ''
                };
              }
              $scope.Leads.push({
                id: lead.id,
                hasNames : (lead.person.firstname.length > 0 || lead.person.lastname.length > 0),
                firstname: lead.person.firstname,
                lastname: lead.person.lastname,
                phone: lead.phone.number || '',
                company: lead.person.company
              });
            });

          }, function (error) {
            $scope.errors = error;
          });

        $scope.Edit = function () {
          $state.go('index.lead', {id: $stateParams.id});
        };

        $scope.goto = function (id) {
          $state.go('index.lead', {id: id});
        };
      }

      init();
    }]);
