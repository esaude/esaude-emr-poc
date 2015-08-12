'use strict';
 
angular.module('home')
 
.factory('authenticationService',
    ['$http', '$cookieStore', '$rootScope', '$window', '$q',
    function ($http, $cookieStore, $rootScope, $window, $q) {
        var sessionResourcePath = 'http://localhost\:8080/openmrs/ws/rest/v1/session';

        var createSession = function(username, password){
            return $http.get(sessionResourcePath, {
                headers: {'Authorization': 'Basic ' + $window.btoa(username + ':' + password),
                          'Access-Control-Allow-Origin': '*'},
                cache: false
            });
        };
        
        var service = {};

//        service.login = function (username, password, callback) {
//            /* Dummy authentication for testing, uses $timeout to simulate api call
//             ----------------------------------------------*/
//            $timeout(function(){
//                var response = { success: username === 'test' && password === 'test' };
//                if(!response.success) {
//                    response.message = 'Username or password is incorrect';
//                }
//                callback(response);
//            }, 1000);
//
//
//            /* Use this for real authentication
//             ----------------------------------------------*/
//            //$http.post('/api/authenticate', { username: username, password: password })
//            //    .success(function (response) {
//            //        callback(response);
//            //    });
//
//        };
        
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
        
        this.loadCredentials = function () {
            var deferrable = $q.defer();
            
            return deferrable.promise;
        };
 
        service.setCredentials = function (username, password) {
            var authdata = $window.btoa(username + ':' + password);
 
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };
 
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        };
 
        service.clearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };
 
        return service;
    }]);