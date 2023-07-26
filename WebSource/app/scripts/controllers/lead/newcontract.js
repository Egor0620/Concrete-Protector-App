angular.module('estimateApp')
    .controller('NewContractCtrl', [
        '$scope', '$q', 'project','Contract','ContractTemplate','Storage',
        function ($scope, $q, project,Contract, ContractTemplate, Storage) {
            "use strict";

            function init() {
                $scope.Project ={};


                ContractTemplate.Search([],{storageType: 'contracttemplatelayout', searchType: 'use'})
                    .then(function(contractTemplates){
                            $scope.ContractTemplates = contractTemplates;
                    }, function(error){
                       var e = 'do something with the error ' + error;
                    });

                Contract.ProjectDetails(project)
                    .then(function(results){
                        $scope.Project = results;
                    });

                $scope.TemplateChange = function(id){
                    var selectedTemplate =_.where($scope.ContractTemplates,{id:id})[0];
                    var criteria = [];
                    criteria.push({'id': selectedTemplate.layoutid});
                    criteria.push({fid: selectedTemplate.id});

                    var searches = [];
                    searches.push(Storage.Search([{'id': selectedTemplate.layoutid}],{storageType:'contracttemplatelayout', searchType : 'use', populate : false}));
                    searches.push(Storage.Search([{'fid': selectedTemplate.id}],{storageType:'contracttemplateheader', searchType : 'use', populate : false}))
                    searches.push(Storage.Search([{'fid': selectedTemplate.id}],{storageType:'contracttemplatefooter', searchType : 'use', populate : false}))
                    searches.push(Storage.Search([{'fid': selectedTemplate.id}],{storageType:'contracttemplateterm', searchType : 'use', populate : false}))

                    $q.all(searches)
                        .then(function(storage){
                            var storages = _.flatten(storage);
                            var p = storages;
                                //$scope.Layout = storage
                        }, function(error){
                            var e = 'do something with the error ' + error;
                        });
                };
            }

            init();
        }]);