/**
 * Created by tbbates on 5/26/15.
 */
/**
 * @ngdoc service
 * @name estimateApp.Ignore
 * @description
 * # Ignore
 * Service in the estimateApp.
 */
angular.module('estimateApp')
    .service('Ignore', ['BaseFactory', function (BaseFactory) {
        'use strict';

        var service = function(){
            BaseFactory.constructor.call(this, 'ignore');
        };

        service.prototype = Object.create(BaseFactory.constructor.prototype);
        service.prototype.constructor = service;

        return new service();

    }]);