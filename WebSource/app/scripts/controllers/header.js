/**
 * @ngdoc function
 * @name estimateApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the estimateApp
 */
angular.module('estimateApp')
  .controller('HeaderCtrl', [
        '$scope', '$rootScope','Reference','Config','Log', function (
        $scope,$rootScope, Reference, Config,Log) {
    'use strict';

    function init() {

      $scope.title = Reference.Title();

      $scope.GoBack = function () {
        $rootScope.back();
      };
    }
    init();

    $rootScope.$on(Config.SetTitleEvent, function (event, data) {
      $scope.title = data;
    });

      $rootScope.$on(Config.AjaxActivity, function (event, data) {
        $scope.busy = data;
      });

  }]);

