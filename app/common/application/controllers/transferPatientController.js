'use strict';

angular.module('application')
        .controller('TransferPatientController', ['$rootScope', '$filter', '$scope', '$window', 'applicationService',
                    'configurations', 'locationService', 'localStorageService', 'spinner',
            function ($rootScope, $filter, $scope, $window, applicationService, configurations, 
                        locationService, localStorageService, spinner) {

            function init() {
                applicationService.getApps().then(function (appJson) {
                    $scope.apps = eval(appJson.applications);
                });
                
                //find default location and validate it
                return loadDefaultLocation();
            };
            
            var loadDefaultLocation = function () {
                var configNames = ['defaultLocation'];
                return configurations.load(configNames).then(function () {
                    var defaultLocation = configurations.defaultLocation().value;
                    if (defaultLocation !== null) {
                        locationService.get(defaultLocation).then(function (data) {
                            var location = data.data.results[0];
                            if (location) {
                                localStorageService.cookie.remove(Poc.Common.Constants.location);
                                localStorageService.cookie.set(Poc.Common.Constants.location, {name: location.display, uuid: location.uuid}, 7);
                            } else {
                                $rootScope.$broadcast('event:auth-loginRequired', 'LOGIN_LABEL_LOGIN_ERROR_INVALID_DEFAULT_LOCATION');
                            }
                        });
                    } else {
                       $rootScope.$broadcast('event:auth-loginRequired', 'LOGIN_LABEL_LOGIN_ERROR_NO_DEFAULT_LOCATION'); 
                    }
                });
            };

            $scope.linkApp = function (url) {
                $window.location.href = url;
            };
            
            return spinner.forPromise(init());

        }]);
