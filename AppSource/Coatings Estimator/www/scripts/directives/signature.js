
angular.module('estimateApp')
.directive('jSignature', ['$timeout', '$rootScope',
  function ($timeout, $rootScope) {
    'use strict';
    return {
      restrict: 'EA',
      scope: {
        model: '=jSignature',
        penColor: '@',
        lineColor: '@',
        readonly: '=',
        data : '='
      },
      link: function (scope, element, attrs, controller) {
        var exportmodel = scope.data;
        // Style undoButton
        var undoButton = function () {
          var undoButtonStyle = 'position:absolute;display:none;margin:0 !important;top:auto';
          var $undoButton = $('<button type="button" class="btn btn-xs btn-default" style="' + undoButtonStyle +
          '">Undo Last Stroke</button>').appendTo(this.$controlbarLower);
          var buttonWidth = $undoButton.width();
          $undoButton.css('left', Math.round(( this.canvas.width - buttonWidth ) / 2));
          return $undoButton;
        };

        // Create Settings Object
        var settings = {
          UndoButton: undoButton
        };
        if (scope.lineColor) {
          settings['decor-color'] = scope.lineColor;
        }
        if(scope.penColor) {
          settings.color = scope.penColor;
        }
        // Build jSignature Element
        $(element).jSignature(settings);

        // Watch Model
  /* original
        scope.$watch('model', function(newValue, oldValue) {
          if (typeof newValue !== 'undefined') {
            var value = newValue.split(',');
            if (value[1] && value[1].length > 0) {
              try {
                element.jSignature("setData", "data:" + newValue);
              } catch (e) {
                console.log('Nim: jSignature - Bad format while trying to setData', e);
              }
            } else {
              element.jSignature('reset');
            }
          }
        });
*/
        scope.$watch('model', function(newValue, oldValue) {
          if (typeof newValue !== 'undefined') {

           // scope.data = newValue;
            var somevalue = "data:" + newValue;

          }
        });

        // Watch readOnly
        scope.$watch('readonly', function (newValue, oldValue) {
          if(newValue === true) {
            $(element).jSignature('disable');
            // Hide undo button
            element.find('button').css({'display': 'none'});
          } else {
            $(element).jSignature('enable');
            /* original
            var currentModel = scope.model.split(',');
            // Show undo button only if there are actions to undo?
            if (currentModel[1] && currentModel[1].length > 0) {
              element.find('button').css({'display': 'block'});
            }
            */
          }
        });

        scope.$watch('data', function(newvalue, oldvalue){
          //var update the data property
          var p = this;
          var a = p;
        });


        // Bind to jSignature Event
        element.bind('change', function(e){
          // $timeout, 100, true because event happens outside angular's digest cycle
          // and change is called on setData
          $timeout(function () {
            // getData returns an array of [mimetype, string of jSignature's custom Base30-compressed format]
          // -- original  var dataPair = element.jSignature("getData","base30");
            /*
            var dataPair = element.jSignature("getData");
            scope.model = dataPair.join(",");
             svgbase64
            */
            scope.data ='';
            var dataPair;
            var signatureImage =  dataPair = $(element).jSignature("getData");
            //var signatureImage = "data:" + dataPair.join(',');
            $rootScope.signature = scope.data = signatureImage;
            scope.model = signatureImage;
          }, 100, true);
        });
      }
    };
  }
]);
