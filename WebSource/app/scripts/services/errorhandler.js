/**
 * @ngdoc service
 * @name estimateApp.errorhandler
 * @description
 * # errorhandler
 * Service in the estimateApp.
 */
angular.module('estimateApp')
  .service('ErrorHandler', [function () {
    'use strict';
    var service = this;

    var dirtyErrors = [
      {
        dirtyError: 'error: duplicate key value violates unique constraint "ix_account_username"',
        cleanError: 'This username is already in use'
      },
      {
        dirtyError: 'Nobody here by that name',
        cleanError: 'A user with that username can not be found'
      },
      {
        dirtyError: 'missing system id',
        cleanError: 'missing system'
      },
      {
        dirtyError: 'missing arealength',
        cleanError: 'missing length'
      },
      {
        dirtyError: 'missing areawidth',
        cleanError: 'missing width'
      }
    ];

    var skipErrors = [
      'missing area',
      'missing sale price'
    ];

    function cleanError(dirtyError) {
      var clean = _.where(dirtyErrors, {'dirtyError': dirtyError});
      var skip = _.indexOf(skipErrors, dirtyError);
      if(skip > -1){
        return false;
      }
      if (clean && clean.length > 0) {
        return clean[0].cleanError;
      }

      if (_.contains(dirtyError, ('duplicate key value violates unique constraint'))) {
        return 'this item already exists';
      }

      return dirtyError;
    }

    service.CleanError = function (dirtyError) {
      return cleanError(dirtyError);
    };

    service.ProcessError = function (error, errors) {
      var errorProcessed = false;
      if (error) {

        if (error.config && error.status) {
          if (error.config.url) {
            if (_.contains(error.config.url, '/api/v1/account/login') && error.status === 404) {
              errors.push('user not found');
              errorProcessed = true;
            }
          }
        }

        if (!errorProcessed && error.data) {

          //
          var errorObject = error.data.error;

          if (errorObject) {
            if (!errorProcessed && errorObject.indexOf('[') === -1) {
              var theseErrors =errorObject.replace(/"/g,'').replace(/, /g,',').split(',');
              _.each(theseErrors,function(thisError){
                var cleanedError = cleanError(thisError);
                if(cleanedError){
                  errors.push(cleanedError);
                }

              });
              errorProcessed = true;
            }
            if (!errorProcessed && errorObject.indexOf('[') === 0) {
              errorObject = JSON.parse(errorObject);
              angular.forEach(errorObject, function (problem) {
                errors.push(cleanError(problem));
              });
              errorProcessed = true;
            } else if (!errorProcessed && errorObject) {
              errors.push(errorObject);
              errorProcessed = true;
            }
          }

        }

        if (!errorProcessed && error.length > 0) {
          angular.forEach(error, function (problem) {
            errors.push(cleanError(problem));
          });
        }
      }
    };

    return service;
  }]);
