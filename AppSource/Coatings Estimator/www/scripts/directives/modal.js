angular.module('estimateApp')
  .directive('backButton', function(){
    return {
      restrict: 'A',

      link: function(scope, element, attrs) {
        element.bind('click', goBack);

        function goBack() {
          history.back();
          scope.$apply();
        }
      }
    }
  })
    .directive('modal', ['$rootScope','Config',function ($rootScope, Config) {
    'use strict';
    return {
      restrict: 'E',
      replace: true, // Replace with the template below
      transclude: true, // we want to insert custom content inside the directive
      link: function(scope, element, attrs) {

        scope.dialogStyle = {};
        if (attrs.width) {
          scope.dialogStyle.width = attrs.width;
        }
        if (attrs.height) {
          scope.dialogStyle.height = attrs.height;
        }
        scope.hideModal = function() {
          scope.show = false;
        };

        $rootScope.$on(Config.Http403, function (event, data) {
          scope.show = true;
        });

      },
      template: "<div class='ng-modal' ng-show='show'>" +
           "<div class='ng-modal-overlay' ng-click='hideModal()'></div>" +
          "<div class='ng-modal-dialog' ng-style='dialogStyle'>" +
            "<div class='row'>" +
      "<div class='col-md-12 text-center'>" +
        "You do not have permission to perform this action." +
      "</div>" +
      "</div>" +
      "<div class='row'>" +
      "<div class='col-md-12 text-center'>" +
          "<button ng-click='hideModal()' class='btn btn-danger'>Close</button>" +
      "</div>" +
      "</div>" +
      "</div></div>"
    };
    }]);
