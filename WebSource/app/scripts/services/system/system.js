angular.module('estimateApp')
    .service('System', ['$q', 'Service', 'SystemDetail', function ($q, Service, SystemDetail) {
        'use strict';
        var service = this;

        var url = {
            search: 'api/v1/system/search',
            add: 'api/v1/system',
            update: 'api/v1/system'
        };

        service.GetSystems = function (populate, searchType) {
            var searchCriteria = {},
                criteria = [];
            if (populate) {
                criteria.push({'populate': 'true'});
            }
            searchCriteria.criteria = criteria;
            searchCriteria.searchType = searchType;
            return Service.Post(searchCriteria, url.search);
        };

        service.GetSystem = function (id, populate, searchType) {
            var searchCriteria = {},
                criteria = [];

            criteria.push({'id': id});

            if (populate) {
                criteria.push({'populate': 'true'});
            }
            searchCriteria.criteria = criteria;
            searchCriteria.searchType = searchType;
            return Service.Post(searchCriteria, url.search);
        };

        //searchType is use or maintain
        service.GetAll = function (searchType) {
            var searchCriteria = {};
            searchCriteria.searchType = searchType;
            searchCriteria.criteria = [];
            return Service.Post(searchCriteria, url.search);
        };

        service.Get = function (id, searchType) {
            var searchCriteria = {},
                criteria = [];
            criteria.push({'id': id});
            searchCriteria.criteria = criteria;
            searchCriteria.searchType = searchType;
            return Service.Post(searchCriteria, url.search);
        };

        service.Add = function (model) {
            var response = $q.defer();
            Service.Post(model, url.add)
                .then(function (result) {
                    var saves = [];
                    saves.push(buildSaveIngredients(result.id, model.ingredients));
                    $q.all(saves)
                        .then(function (saveresult) {
                            return response.resolve(saveresult);
                        },
                        function (error) {
                            return response.reject(error);
                        });
                },
                function (error) {
                    return response.reject(error);
                });
            return response.promise;
        };

        service.Update = function (model) {
            var response = $q.defer();
            Service.Put(model, url.update)
                .then(function (result) {
                    var saves = [];
                    saves.push(buildSaveIngredients(result.id, model.ingredients));
                    $q.all(saves)
                        .then(function (saveresult) {
                            return response.resolve(saveresult);
                        },
                        function (error) {
                            return response.reject(error);
                        });
                },
                function (error) {
                    return response.reject(error);
                });
            return response.promise;
        };

        function buildSaveIngredients(id, ingredients) {
            var response = $q.defer();
            var innerResponse = [],
                i = 0;
            _.each(ingredients, function (ingredient) {
                i = i + 1;

                var systemdetail = {};
                //There is not an systemdetailid = this is a new association
                if (!ingredient.systemdetailid) {
                    if (ingredient.checked === true) {
                        systemdetail.systemid = id;
                        systemdetail.ingredientid = ingredient.id;
                        if (ingredient.extra) {
                            systemdetail.extra = ingredient.extra;
                        }
                        systemdetail.factor = ingredient.factor;
                        innerResponse.push(SystemDetail.Add(systemdetail));
                    }

                } else {
                    // These will be associations where the ingredient is not checked
                    // we will remove these as they are not checked
                    var action = '';

                    if (ingredient.extra || ingredient.primeextra) {
                        if (ingredient.extra !== ingredient.primeextra) {
                            action = 'update';
                        }
                    }

                    if (ingredient.factor || ingredient.primefactor) {
                        if (ingredient.factor !== ingredient.primefactor) {
                            action = 'update';
                        }
                    }

                    if (ingredient.checked === false) {
                        action = 'delete';
                    }
                    if (action === 'update') {
                        systemdetail.id = ingredient.systemdetailid;
                        systemdetail.extra = ingredient.extra;
                        systemdetail.factor = ingredient.factor;
                        systemdetail.version = ingredient.systemdetailversion;
                        innerResponse.push(SystemDetail.Update(systemdetail));
                    }
                    if (action === 'delete') {
                        innerResponse.push(SystemDetail.Remove(ingredient.systemdetailid));
                    }

                }
            });
            if (i === ingredients.length) {
                return response.resolve(innerResponse);
            }
            return response.promise;
        }


        service.StatusOptions = [
            {key: '1', statusDisplay: 'active'},
            {key: '0', statusDisplay: 'inactive'}
        ];

        service.FactorOptions = [
            {key: '1', display: '1'},
            {key: '2', display: '2'},
            {key: '3', display: '3'},
            {key: '4', display: '4'},
            {key: '5', display: '5'},
            {key: '6', display: '6'},
            {key: '7', display: '7'},
            {key: '8', display: '8'},
            {key: '9', display: '9'},
            {key: '10', display: '10'}
        ];

        return service;
    }]);
