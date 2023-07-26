/**
 * @ngdoc function
 * @name estimateApp.controller:SystemCtrl
 * @description
 * # SystemCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
  .controller('SystemCtrl', ['$rootScope', '$state', '$scope', '$stateParams','$q', 'System','Reference', 'Ingredient','SystemDetail','Authorization',  function ($rootScope, $state, $scope, $stateParams, $q, System, Reference, Ingredient , SystemDetail, Authorization) {
    'use strict';
    function init() {
      $scope.saving = false;
      $scope.IsInRoles = function (roles) {
        return Authorization.IsInRole(roles);
      };

      $scope.System = {
        name : ''
      };

      $scope.IsNew = true;
      $scope.IngredientCount = 0;

      function get(id) {
        $scope.IsNew = false;
        System.Get(id, {'type' : 'maintain'})
          .then(function (result) {
            var innerResult = result[0];
            var saleprice = 0;
            if(innerResult.saleprice){
              if(!isNaN(innerResult.saleprice)){
                saleprice = Number(innerResult.saleprice);
              }
            }
            innerResult.saleprice = saleprice;

            $scope.System = innerResult;
          },
          function (error) {
            $scope.errors = error;
          }
        );
      }

      function getSystemIngredients(id){
        var criteria = [];
        criteria.push({'systemid': id});

        SystemDetail.Search(criteria)
          .then(function (result) {
            $scope.SystemIngredients =result;
            getIngredients(result);

          }, function (error) {
            $scope.errors = error;
          });
      }

      if ($stateParams.id) {
        get($stateParams.id);
        getSystemIngredients($stateParams.id);
      }
      else{
        getIngredients();
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
          $scope.saving = false;
          return;
        }

        model.ingredients = $scope.Ingredients;

        model.error = [];
        model.errors = [];

        if ($stateParams.id && ($stateParams.id).length > 10) {
          System.Update(model)
            .then(function (result) {
              $scope.saving = false;
              $rootScope.back();
            },
            function (error) {
              $scope.saving = false;
              Reference.ProcessError(error, model.errors);
            }
          );
        }
        else{
          System.Add(model)
            .then(function (result) {
              $scope.saving = false;
              $rootScope.back();
            },
            function (error) {
              $scope.saving = false;
              Reference.ProcessError(error, model.errors);
            }
          );
        }
      };

      $scope.checkIngredient = function(id){
        var primary = _.where($scope.Ingredients, {'id': id})[0];
        primary.checked = !primary.checked;
        countIngredients();
      };

      function validate(model, errors) {

        if (!model || model.name === '') {
          errors.push('missing name');
        }
        if(!model.saleprice){
          errors.push('missing system price');
        }

      }

      function getIngredients(systemIngredients){
        Ingredient.Get()
          .then(function (result) {
            if(!systemIngredients){
              $scope.Ingredients =_.sortBy(result, 'name');
              return;
            }
            var innerIngredients = result;
            _.each(innerIngredients,function(ingredient){
              var ic = _.where(systemIngredients, {'ingredientid': ingredient.id})[0];
              if(ic){
                ingredient.systemdetailid = ic.id;
                ingredient.checked = true;
                ingredient.extra = ic.extra;
                ingredient.primeextra =angular.copy(ingredient.extra);
                ingredient.factor = ic.factor;
                ingredient.primefactor = angular.copy(ingredient.factor);
                ingredient.systemdetailversion = ic.version;
              }
            });
            $scope.Ingredients =_.sortBy(innerIngredients, ['checked','name']);
            countIngredients();

          }, function (error) {
            $scope.errors = error;
          });
      }

      function countIngredients(){
        var count =_.where($scope.Ingredients, {'checked' : true}).length;
        $scope.IngredientCount = count;
        return count;
      }

      $scope.StatusOptions = System.StatusOptions;
      $scope.FactorOptions = System.FactorOptions;

    }

    init();
  }]);
