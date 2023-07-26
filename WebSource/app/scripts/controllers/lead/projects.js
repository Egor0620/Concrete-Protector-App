/**
 * @ngdoc function
 * @name estimateApp.controller:ProjectsCtrl
 * @description
 * # ProjectsCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
  .controller('ProjectsCtrl', ['$scope', '$stateParams','$rootScope', 'Project', 'Config','Utility',
    function ($scope, $stateParams,$rootScope, Project, Config, Utility) {

      'use strict';

      function init() {

        $scope.Projects = [];
        $scope.UpperTime = '';
        $scope.LowerTime = '';
        $scope.IdParam = false;
        $scope.SearchPlaceholder = '';

        var status = 1,
          statusName = 'Active',
          time = 'current',
          displayTime = 'Estimates';

        if ($stateParams.status.length > -1) {
          status = parseInt($stateParams.status);

          if(status === 0){
            statusName = 'Inactive';
          }
        }

        if ($stateParams.time) {
          time = $stateParams.time;

          if(time === 'current'){
            displayTime = 'Current Projects';
            $scope.datename ='Install Date';
          }
          if(time === 'complete'){
            displayTime = 'Complete Projects';
            $scope.datename ='Complete Date';
          }

          if(time ==='estimate'){
            displayTime = 'Estimates';
            $scope.datename ='Date Added';
          }


        }
        var locationName = statusName + ' ' + displayTime;
        $rootScope.$broadcast(Config.SetTitleEvent, locationName);

        $scope.SearchPlaceholder = 'search ' + locationName.toLocaleLowerCase();

        var hint = {
          searchType: 'use',
          populate: true
          };


        var criteria = [{status: status}, {time: time}];
        Project.Search(criteria, hint)
          .then(function(results){
            _.each(results, function (result) {
              var innerproject = {};
              innerproject.firstname = result.person.firstname;
              innerproject.lastname = result.person.lastname;
              innerproject.company = result.person.company;
              innerproject.area = result.totalarea;
              innerproject.cost = result.totalcost;
              innerproject.leadid = result.leadid;
              innerproject.date = '';
              innerproject.hasdate = false;
              innerproject.hasnames = (result.person.firstname.length > 0 || result.person.lastname.length > 0);

              if (time === 'estimate') {
                innerproject.hasdate = (result.added.length > 0);
                innerproject.date = new Date(result.added);
              }
              if (time === 'current') {
                innerproject.hasdate = (result.install);
                innerproject.date = new Date(result.install);
              }
              if (time === 'complete') {
                innerproject.hasdate = (result.completed);
                innerproject.date = new Date(result.completed);
              }

              innerproject.id = result.id;

              $scope.Projects.push(innerproject);
            });
          }, function(error){
            $scope.errors = error;
          });

      }

      init();

    }]);
