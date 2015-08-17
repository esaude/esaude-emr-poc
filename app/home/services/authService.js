'use strict';
 
angular.module('home')
 
.factory('authenticationService',
    ['$http', '$cookieStore', '$rootScope', '$window', '$q', 'userService',
    function ($http, $cookieStore, $rootScope, $window, $q, userService) {
        var sessionResourcePath = '/openmrs/ws/rest/v1/session';

        var service = {};
        
        var createSession = function(username, password){
            return $http.get(sessionResourcePath, {
                headers: {'Authorization': 'Basic ' + $window.btoa(username + ':' + password)},
                cache: false
            });
        };
        
        var hasAnyActiveProvider = function (providers) {
            return _.filter(providers, function (provider) {
                    return (provider.retired == undefined || provider.retired == "false")
                }).length > 0;
        };
        
        service.destroy = function(){
            return $http.delete(sessionResourcePath).success(function(data){
                delete $.cookie('user', null, {path: "/"});
                $rootScope.currentUser = null;
            });
        };
        
        service.loginUser = function(username, password) {
            var deferrable = $q.defer();
            createSession(username,password).success(function(data) {
                if (data.authenticated) {
                    $cookieStore.put('user', username, {path: '/', expires: 7});
                    deferrable.resolve();
                } else {
                   deferrable.reject('Authentication failed. Please try again.');   
                }
            }).error(function(){
                deferrable.reject('Authentication failed. Please try again.');   
            });
            return deferrable.promise;
        };
        
        service.get = function () {
            return $http.get(sessionResourcePath, { cache: false });
        };
        
        service.loadCredentials = function () {
            var deferrable = $q.defer();
            var currentUser = $cookieStore.get('user');
            if(!currentUser) {
                this.destroy().then(function() {
                    $rootScope.$broadcast('event:auth-loginRequired');
                    deferrable.reject("No User in session. Please login again.")
                });
                return deferrable.promise;
            }
            userService.getUser(currentUser).success(function(data) {
                userService.getProviderForUser(data.results[0].uuid).success(function(providers){
                        
                        if(!_.isEmpty(providers.results) && hasAnyActiveProvider(providers.results)){
                            $rootScope.currentUser = data.results[0];
                            $rootScope.$broadcast('event:user-credentialsLoaded', data.results[0]);
                            deferrable.resolve(data.results[0]);
                        }else{
                            service.destroy();
                            deferrable.reject('You have not been setup as a Provider, please contact administrator.');
                        }
                    }
                ).error(function(){
                        service.destroy();
                        deferrable.reject('Could not get provider for the current user.');
                    });
            }).error(function () {
                service.destroy();
                deferrable.reject('Could not get roles for the current user.');
            });
            return deferrable.promise;
        };
 
        return service;
    }]);