angular.module('estimateApp')
    .service('ContractTemplate', ['BaseFactory', function (BaseFactory) {
        'use strict';

        var service = function(){
            BaseFactory.constructor.call(this, 'contracttemplate');
        };

        service.prototype = Object.create(BaseFactory.constructor.prototype);
        service.prototype.constructor = service;

        return new service();

    }]);