/**
 * Created by tbbates on 5/29/15.
 */
angular.module('estimateApp')
.filter("sanitize", ['$sce', function($sce) {
    'use strict';
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    };
}]);