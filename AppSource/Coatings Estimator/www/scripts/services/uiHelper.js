

angular.module('estimateApp')
    .service('uiHelper', function Account($rootScope, $ionicLoading, $ionicPopup) {
    	'use strict';
    	var service = this;

    	service.showLoadingWheel = function() {
            $ionicLoading.show({
                template: 'Loading...'
            });
    	};

        service.hideLoadingWheel = function() {
            $ionicLoading.hide();
        };

        service.validateString = function(val) {
            return typeof(val) != 'undefined' && val != null && val != "";
        };


        service.alert = function($scope, title, message, callback) {
            $scope.message = message;
            window.scrollTo(0, 0);

            $ionicPopup.show({
                templateUrl: 'views/common/confirmBox.html',
                title: title,
                //subTitle: 'WPA2',
                scope: $scope,
                buttons: [
                    {
                      text: 'OK',
                      type: 'btn-ok',
                      onTap: function(e) {
                        return true;
                      }
                    },
                ]
                }).then(function(res) {
                    if (callback)
                        callback(res);
                    }, function(err) {
                        console.log('Err:', err);
                    }, function(msg) {
                        console.log('message:', msg);
                });
        };

        service.confirm = function($scope, title, message, callback) {
            $scope.message = message;

            $ionicPopup.show({
                templateUrl: 'views/snippets/confirmBox.html',
                title: title,
                //subTitle: 'WPA2',
                scope: $scope,
                buttons: [
                    {
                        text: 'CANCEL',
                        type: 'btn-cancel',
                        onTap: function(e) {
                            return false;
                        }
                    },
                    {
                      text: 'YES',
                      type: 'btn-ok',
                      onTap: function(e) {
                        return true;
                      }
                    },
                ]
                }).then(function(res) {
                        callback(res);
                    }, function(err) {
                        console.log('Err:', err);
                    }, function(msg) {
                        console.log('message:', msg);
                });
        };

        service.showNoty = function(msg, type) {
            var n = noty({
                text        : msg,
                type        : typeof(type) == 'undefined' ? 'success' : type,
                dismissQueue: true,
                timeout     : 2000,
                closeWith   : ['click'],
                layout      : 'topRight',
                theme       : 'defaultTheme',
                maxVisible  : 5
            });
        }

    	return service;
    });
