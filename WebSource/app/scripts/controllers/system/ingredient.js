/**
 * @ngdoc function
 * @name estimateApp.controller:SystemCtrl
 * @description
 * # SystemCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
  .controller('IngredientCtrl', ['$rootScope', '$state', '$scope', '$stateParams', 'Ingredient','Reference', 'Color', 'Pattern','IngredientColor','IngredientPattern',
    function ($rootScope, $state, $scope, $stateParams, Service , Reference, Color, Pattern, IngredientColor, IngredientPattern) {
    'use strict';
    function init() {
      $scope.saving = false;
      $scope.Model = {
        name : '',
        coverage : 0,
        purchaseprice : 0
      };
      $scope.PatternsCount = 0;
      $scope.ColorsCount = 0;

      function get(id) {
        Service.Get(id)
          .then(function (result) {
            if(result[0]){
              fixServiceModel(result[0]);
            }
          },
          function (error) {
            $scope.errors = error;
          }
        );
      }

      function getIngredientColors(id){
        var criteria = [];
        criteria.push({'ingredientid': id});

        IngredientColor.Search(criteria)
          .then(function (result) {
            $scope.IngredientColors =result;
            getColors(result);
          }, function (error) {
            $scope.errors = error;
          });
      }

      function getIngredientPatterns(id){
        var criteria = [];
        criteria.push({'ingredientid': id});

        IngredientPattern.Search(criteria)
          .then(function (result) {
            $scope.IngredientPatterns =result;
            getPatterns(result);

          }, function (error) {
            $scope.errors = error;
          });
      }

      if ($stateParams.id) {
        get($stateParams.id);
        getIngredientColors($stateParams.id);
        getIngredientPatterns($stateParams.id);
      }
      else{
        getColors();
        getPatterns();
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

        model.colors = $scope.Colors;
        model.patterns = $scope.Patterns;

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
              Reference.ProcessError(error, model.errors);
            }
          );
        }
        else{
          Service.Add(model)
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

      $scope.checkColor = function(id){
        var primary = _.where($scope.Colors, {'id': id})[0];
        primary.checked = !primary.checked;
        countColors();
      };

      $scope.checkPattern = function(id){
        var primary = _.where($scope.Patterns, {'id': id})[0];
        primary.checked = !primary.checked;
        countPatterns();
      };

      function validate(model, errors) {

        if (model.name === '') {
          errors.push('missing name');
        }

        if(!model.coverage || model.coverage === ''){
          errors.push('missing coverage area');
        }

        if(!model.purchaseprice || model.purchaseprice === ''){
          errors.push('missing purchase price');
        }

      }

      function fixServiceModel(model) {
        if (model.coverage) {
          model.coverage = Number(model.coverage);
        }

        if(model.purchaseprice){
          model.purchaseprice = Number(model.purchaseprice);
        }

        $scope.Model = model;
      }

      function getColors(ingredientColors){
        Color.Get()
          .then(function (result) {
            if(!ingredientColors){
              $scope.Colors =_.sortBy(result, 'name');
              return;
            }
            var innerColors = result;
            _.each(innerColors,function(color){
             var ic = _.where(ingredientColors, {'colorid': color.id})[0];
              if(ic){
                color.ingredientcolorid = ic.id;
                color.checked = true;
              }
            });
            $scope.Colors =_.sortBy(innerColors, 'name');
            countColors();
          }, function (error) {
            $scope.errors = error;
          });
      }

      function getPatterns(ingredientPatterns){
        Pattern.Get()
          .then(function (result) {
            if(!ingredientPatterns){
              $scope.Patterns =_.sortBy(result, 'name');
              return;
            }
            var innerPatterns = result;
            _.each(innerPatterns, function(pattern){
              var ip = _.where(ingredientPatterns, {'patternid' :  pattern.id})[0];
            if(ip){
              pattern.ingredientpatternid = ip.id;
              pattern.checked = true;
            }
            });
            $scope.Patterns =_.sortBy(innerPatterns, 'name');
            countPatterns();
          }, function (error) {
            $scope.errors = error;
          });
      }

      function countColors(){
        var count =_.where($scope.Colors, {'checked' : true}).length;
        $scope.ColorsCount = count;
        return count;
      }

      function countPatterns(){
        var count =_.where($scope.Patterns, {'checked' : true}).length;
        $scope.PatternsCount = count;
        return count;
      }

    }

    init();
  }]);
