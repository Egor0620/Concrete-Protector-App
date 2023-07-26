angular.module('estimateApp')
  .service('Ingredient', ['$q','Service','IngredientColor','IngredientPattern', function ($q, Service, IngredientColor, IngredientPattern) {
    'use strict';
    var service = this;

    var url = {
      search: 'api/v1/ingredient/search',
      add: 'api/v1/ingredient',
      update: 'api/v1/ingredient',
      remove: 'api/v1/ingredient',
    };

    service.GetAll = function () {
      var searchCriteria = {};
      searchCriteria.criteria = [];
      return Service.Post(searchCriteria, url.search);
    };

    service.Search = function(criteria){
      var searchCriteria = {};
      searchCriteria.criteria = criteria;
      return Service.Post(searchCriteria, url.search);
    };

    service.Get = function (id) {
      var searchCriteria = {},
        criteria = [];
      criteria.push({'id': id});
      searchCriteria.criteria = criteria;
      return Service.Post(searchCriteria, url.search);
    };

    service.Add = function (model) {
      var response = $q.defer();
       Service.Post(model, url.add)
         .then(function(result){
           var saves = [];
           saves.push(buildSaveColors(result.id, model.colors));
           saves.push(buildSavePatterns(result.id, model.patterns));
           $q.all(saves)
             .then(function(saveresult){
               return response.resolve(saveresult);
             },
             function(error){
               return response.reject(error);
             });
         },
         function(error){
           return response.reject(error);
         });
      return response.promise;
    };

    service.Update = function (model) {
      var response = $q.defer();
      Service.Put(model, url.update)
        .then(function(result){
          var saves = [];
          saves.push(buildSaveColors(result.id, model.colors));
          saves.push(buildSavePatterns(result.id, model.patterns));
          $q.all(saves)
            .then(function(saveresult){
              return response.resolve(saveresult);
            },
            function(error){
              return response.reject(error);
            });
        },
        function(error){
          return response.reject(error);
        });
      return response.promise;
    };

    service.Remove = function (id) {
      var response = $q.defer();
      Service.Remove(id, url.remove)
        .then(function(result){
          var saves = [];
          //saves.push(buildSaveColors(result.id, model.colors));
          //saves.push(buildSavePatterns(result.id, model.patterns));
          $q.all(saves)
            .then(function(saveresult){
              return response.resolve(saveresult);
            },
            function(error){
              return response.reject(error);
            });
        },
        function(error){
          return response.reject(error);
        });
      return response.promise;
    };

    function buildSaveColors(id, colors){
      var response = $q.defer();
      var innerResponse = [],
        i = 0;
      _.each(colors, function (color) {
        i = i + 1;

        var ingredientcolor = {};
      //There is not an ingredientcolorid = this is a new association
        if(!color.ingredientcolorid){
          if(color.checked === true){
            ingredientcolor.ingredientid = id;
            ingredientcolor.colorid = color.id;
            innerResponse.push(IngredientColor.Add(ingredientcolor));
          }

        } else {
          // These will be associations where the color is not checked
          // we will remove these as they are not checked
          if(color.checked === false){
            innerResponse.push(IngredientColor.Remove(color.ingredientcolorid));
          }
        }

      });
      if(i === colors.length){
       return response.resolve(innerResponse);
      }
      return response.promise;
    }

    function buildSavePatterns(id, patterns){
      var response = $q.defer();
      var innerResponse = [],
        i=0;
      _.each(patterns, function (pattern) {
        i = i + 1;
        var ingredientpattern = {};
        //There is not an ingredientpatternid = this is a new association
        if(!pattern.ingredientpatternid){
          if(pattern.checked === true){
            ingredientpattern.ingredientid = id;
            ingredientpattern.patternid = pattern.id;
            innerResponse.push(IngredientPattern.Add(ingredientpattern));
          }

        } else {
          // These will be associations where the pattern is not checked
          // we will remove these as they are not checked
          if(pattern.checked === false){
            innerResponse.push(IngredientPattern.Remove(pattern.ingredientpatternid));
          }
        }

      });
      if(i === patterns.length){
       return response.resolve(innerResponse);
      }
      return response.promise;
    }

    return service;
  }]);
