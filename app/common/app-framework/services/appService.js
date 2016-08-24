'use strict';

angular.module('bahmni.common.appFramework')
    .service('appService', ['$http', '$q', 'sessionService', '$rootScope', function ($http, $q, sessionService, $rootScope) {
        var currentUser = null;
        var baseUrl = "/poc_config/openmrs/apps/";
        var appDescriptor = null;
        var self = this;

        var loadConfig = function (url) {
            return $http.get(url, {withCredentials: true});
        };
        
        var loadFormLayout = function (appDescriptor) {
            var deferrable = $q.defer();
            loadConfig(baseUrl + "/common/formLayout.json").then(
                function (result) {
                    appDescriptor.setFormLayout(result.data);
                    
                    deferrable.resolve(appDescriptor);
                },
                function (error) {
                    if (error.status != 404) {
                        deferrable.reject(error);
                    } else {
                        deferrable.resolve(appDescriptor);
                    }
                }
            );
            return deferrable.promise;
        };
        
        var loadClinicalServices = function (appDescriptor) {
            var deferrable = $q.defer();
            loadConfig(baseUrl  + appDescriptor.contextPath +  "/clinicalServices.json").then(
                function (result) {
                    appDescriptor.setClinicalServices(result.data);
                    
                    deferrable.resolve(appDescriptor);
                },
                function (error) {
                    if (error.status != 404) {
                        deferrable.reject(error);
                    } else {
                        deferrable.resolve(appDescriptor);
                    }
                }
            );
            return deferrable.promise;
        };

        var loadDefinition = function (appDescriptor) {
            var deferrable = $q.defer();
            loadConfig(baseUrl + appDescriptor.contextPath + "/app.json").then(
                function (result) {
                    if (result.data.length > 0) {
                        appDescriptor.setDefinition(result.data[0]);
                    }
                    deferrable.resolve(appDescriptor);
                },
                function (error) {
                    if (error.status != 404) {
                        deferrable.reject(error);
                    } else {
                        deferrable.resolve(appDescriptor);
                    }
                }
            );
            return deferrable.promise;
        };

        this.getAppDescriptor = function () {
            return appDescriptor;
        };

        this.initApp = function (appName, options) {

            var appLoader = $q.defer();
            var promises = [];
            var opts = options || {'app': true, 'extension': true, 'service': false};

            var inheritAppContext = (opts.inherit == undefined) ? true : opts.inherit;

            appDescriptor = new Bahmni.Common.AppFramework.AppDescriptor(appName, inheritAppContext, function () {
                return currentUser;
            });
            
            var loadCredentialsPromise = sessionService.loadCredentials();
            promises.push(loadCredentialsPromise);

            if (opts.service) {
                promises.push(loadFormLayout(appDescriptor));
                promises.push(loadClinicalServices(appDescriptor));
            }
            
            if (opts.app) {
                promises.push(loadDefinition(appDescriptor));
            }
            $q.all(promises).then(function (results) {
                currentUser = results[0];
                appLoader.resolve(appDescriptor);
            }, function (errors) {
                appLoader.reject(errors);
            });
            return appLoader.promise;
        };
    }]);