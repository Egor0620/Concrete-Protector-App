angular.module('estimateApp')
    .service('Contract', [
        '$q', 'BaseFactory', 'System', 'Ingredient', 'Color', 'Pattern', function ($q, BaseFactory, System, Ingredient, Color, Pattern) {
            'use strict';

            var service = function () {
                BaseFactory.constructor.call(this, 'contract');
            };

            service.prototype = Object.create(BaseFactory.constructor.prototype);
            service.prototype.constructor = service;
            service.prototype.ProjectDetails = populateProject;

            function getProjectDetails(project) {
                if (project.constructor === Array) {
                    project = project[0];
                }
                var response = $q.defer();
                var systemIds = [];
                var ingredientIds = [];
                var colorIds = [];
                var patternIds = [];
                var imageIds = [];
                var searches = [];


                imageIds.push({fid: project.id});

                _.each(project.details, function (detail) {

                    //searches.push(System.GetSystem(detail.systemid,false, 'use'));
                    if (_.where(systemIds, {id: detail.systemid}).length === 0) {
                        systemIds.push({id: detail.systemid});

                    }

                    _.each(detail.styles, function (style) {
                        if (style.ingredientid) {
                            ingredientIds.push({id: style.ingredientid});
                        }
                        if (style.colorid) {
                            colorIds.push({id: style.colorid});
                        }
                        if (style.patternid) {
                            patternIds.push({id: style.patternid});
                        }
                    });

                });

                _.each(systemIds, function (system) {
                    searches.push(System.GetSystem(system.id, false, 'use'));
                });

                searches.push(Ingredient.Search(ingredientIds));
                searches.push(Color.Search(colorIds));
                searches.push(Pattern.Search(patternIds));


                $q.all(searches)
                    .then(function (results) {
                        response.resolve(results);


                    }, function (errors) {
                        response.reject(errors);
                    });


                return response.promise;

            }

            function populateProject(project){
                if (project.constructor === Array) {
                    project = project[0];
                }
                var response = $q.defer();

                getProjectDetails(project)
                    .then(function (results) {

                        _.each(project.details, function(detail){
                            var innerSystem = resolver(detail.systemid, results);
                            detail.system = innerSystem[0];
                            _.each(detail.styles, function(style){
                                var innerIngredient = resolver(style.ingredientid, results);
                                if(innerIngredient.length !== 0){
                                    style.ingredient = innerIngredient[0];
                                }
                                var innerColor = resolver(style.colorid, results);
                                if(innerColor.length !== 0){
                                    style.color = innerColor[0];
                                }
                                var innerPattern = resolver(style.patternid, results);
                                if(innerPattern.length !== 0){
                                    style.pattern = innerPattern[0];
                                }
                            });


                        });


                        response.resolve(project);
                    }, function (errors) {
                        response.reject(errors);
                    });

                return response.promise;

            }

            function resolver(id, results){
                return _.where( _.flatten(results), {id: id});
            }

            return new service();
        }]);
