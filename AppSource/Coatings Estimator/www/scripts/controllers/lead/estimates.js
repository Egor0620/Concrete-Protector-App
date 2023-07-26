angular.module('estimateApp')
    .controller('EstimatesCtrl', ['$scope', '$stateParams', '$state', 'Project', function ($scope, $stateParams, $state, Project) {

        'use strict';

        function init() {

            $scope.Estimates = [];

            var time = false,
                id = false;


            if ($stateParams.id > 0) {
                id = $stateParams.id;
            }
            if ($stateParams.time !== '') {
                time = $stateParams.time;
            }

            Project.GetProjectDetails(time, id)
                .then(function (result) {
                    $scope.Estimate = result;
                },
                function (error) {
                    $scope.errors = error;
                }
            );

            $scope.Edit = function () {
                $state.go('index.project', {id: $stateParams.id});
            };

        }

        init();

    }]);
