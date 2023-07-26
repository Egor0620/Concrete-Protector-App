/**
 * @ngdoc function
 * @name estimateApp.controller:TeamCtrl
 * @description
 * # TeamCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
  .controller('TeamCtrl', ['$scope', '$stateParams', '$rootScope', '$window', 'Team', 'Reference', 'Authorization', 'Utility',
    function ($scope, $stateParams, $rootScope, $window, Team, Reference, Authorization, Utility) {
      'use strict';
      function init() {
        $scope.Members = [];
        $scope.Member = {};
        $scope.saving = false;

        var hints = {
          mode: 'use',
          populate: true
        };

        function populate() {
          Team.Get(hints)
            .then(function (result) {
              _.each(result, function(member){
                Team.PopulatePermissions(member);
                member.system = 0;
                member.person = 0;
                member.financial = 0;
                member.contract = 0;
                if(member.readsystem){
                  member.system = 1;
                }
                if(member.editsystem){
                  member.system = 2;
                }
                if(member.readlead){
                  member.person = 1;
                }
                if(member.editlead){
                  member.person = 2;
                }
                if(member.readfinancial){
                  member.financial = 1;
                }
                if(member.editfinancial){
                  member.financial = 2;
                }
                if(member.readcontract){
                  member.contract = 1;
                }
                if(member.editcontract){
                  member.contract = 2;
                }
              });
              $scope.Members =_.sortBy(result, 'email');
            }, function (error) {
              $scope.errors = error;
            });
        }

        populate();

        $scope.CancelEdit = function () {
          $scope.editing = false;
        };

        $scope.NewMember = function () {
          $scope.Member = {
            'email': '',
            'readsystem': false,
            'editsystem': false,
            'readlead': false,
            'editlead': false,
            'readfinancial': false,
            'editfinancial': false,
            'readcontract': false,
            'editcontract': false
          };
          $scope.editing = true;
          $scope.isNew = true;
        };

        $scope.EditMember = function (model, index) {
          $scope.Member = {};
          $scope.isNew = false;
          $scope.MemberPrime = model;
          $scope.MemberPrimeIndex = index;
          $scope.Member = angular.copy(model);
          Team.PopulatePermissions($scope.Member);
          $scope.editing = true;

        };

        $scope.CancelEdit = function () {
          $scope.editing = false;
          $scope.Member = {};
        };

        $scope.Save = function (model) {
          $scope.saving = true;
          validate(model);

          if (model.errors.length > 0) {
            $scope.saving = false;
            return;
          }
          Team.CalculatePermissions(model);

          if (model.id && (model.id).length > 10) {
            Team.Update(model)
              .then(function (result) {
                $scope.saving = false;
                $scope.editing = false;
                populate();
              },
              function (error) {
                $scope.saving = false;
                model.errors = error;
                model.error = model.errors.join(', ');

              }
            );

          }
          else {
            Team.Add(model)
              .then(function (result) {
                $scope.saving = false;
                $scope.editing = false;
                populate();
              },
              function (error) {
                $scope.saving = false;
                model.errors = error;
                model.error = model.errors.join(', ');
              }
            );
          }

        };

        $scope.Cancel = function () {
          $rootScope.back();
        };

        $scope.RemoveMember = function (model) {

          function removeMember(buttonIndex){
            if(buttonIndex === 1){
              if (model.id) {
                Team.Remove(model.id)
                  .then(function (success) {
                    $scope.Members.splice($scope.MemberPrimeIndex, 1);
                    $scope.editing = false;
                  }, function (error) {
                    // TODO: write a better error message
                    $window.alert(error);
                  });
              }
            }
          }

          if(navigator && navigator.notification){
            navigator.notification.confirm(
              'Are you absolutely sure you want to remove this team member?', // message
              removeMember,// callback to invoke with index of button pressed
              'Delete Team Member',           // title
              ['Yes','No']         // buttonLabels
            );
          }
          else{
            var confirmRemoveImage = $window.confirm('Are you absolutely sure you want to remove this team member?');

            if (confirmRemoveImage) {
              removeMember(1);

            }
          }
        };

        function validate(model) {
          model.errors = [];
          if (!Utility.ValidEmail(model.email)) {
            model.errors.push(model.email + ' is not a valid email');
          }

        }

      }

      init();
    }]);
