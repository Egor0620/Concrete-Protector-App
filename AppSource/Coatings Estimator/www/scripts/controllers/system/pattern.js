/**
 * @ngdoc function
 * @name estimateApp.controller:PatternCtrl
 * @description
 * # PatternCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
  .controller('PatternCtrl', ['$rootScope', '$state', '$scope', '$stateParams', 'Pattern',
    function ($rootScope, $state, $scope, $stateParams, Service) {
      'use strict';
      function init() {
        $scope.saving = false;
        $scope.Model = {
          name: ''
        };

        $scope.IsNew = true;

        function get(id) {
          $scope.IsNew = false;
          Service.Get(id)
            .then(function (result) {
              if (result[0]) {
                $scope.Model = result[0];
              }
            },
            function (error) {
              $scope.errors = error;
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
              .then(function (result) {
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
            Service.Add(model)
              .then(function (result) {
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

        $scope.Remove = function (id) {
          $scope.saving = true;

          Service.Remove(id)
            .then(function (result) {
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

        function validate(model, errors) {

          if (model.name === '') {
            errors.push('missing name');
          }

        }

      }

      init();
    }]);

