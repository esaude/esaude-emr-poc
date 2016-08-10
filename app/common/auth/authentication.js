'use strict';

angular.module('authentication')
    .config(function ($httpProvider) {
        var interceptor = ['$rootScope', '$q', function ($rootScope, $q) {
            function success(response) {
                return response;
            }

            function error(response) {
                if (response.status === 401 || response.status === 403) {
                    $rootScope.$broadcast('event:auth-loginRequired');
                }
                return $q.reject(response);
            }

            return {
                response: success,
                responseError: error
            };
        }];
        $httpProvider.interceptors.push(interceptor);
    }).run(['$rootScope', '$window', '$timeout', 'sessionService', function ($rootScope, $window, $timeout, sessionService) {
        $rootScope.$on('event:auth-loginRequired', function () {
            $timeout(function(){
            	sessionService.destroy().then(
                    function () {
                        $window.location = "../home/#/login?showLoginMessage=true";
                    }
                );
            });
        });
    }]).service('sessionService', ['$rootScope', '$http', '$q', '$cookies', 'userService', 'localStorageService',
                function ($rootScope, $http, $q, $cookies, userService, localStorageService ) {
        var sessionResourcePath = '/openmrs/ws/rest/v1/session';

        var createSession = function(username, password) {
            return $http.get(sessionResourcePath, {
                headers: {'Authorization': 'Basic ' + window.btoa(username + ':' + password)},
                cache: false
            });
        };

        var hasAnyActiveProvider = function (providers) {
            return _.filter(providers, function (provider) {
                    return (provider.retired == undefined || provider.retired == "false")
                }).length > 0;
        };

        var self = this;

        this.destroy = function(){
            return $http.delete(sessionResourcePath).success(function(data){
                $cookies.remove(Bahmni.Common.Constants.currentUser, {path: '/'});
                localStorageService.cookie.remove("emr.location");
                $rootScope.currentUser = null;
            });
        };
        this.loginUser = function(username, password) {
            var deferrable = $q.defer();
            createSession(username,password).success(function(data) {
                if (data.authenticated) {
                    $cookies.put(Bahmni.Common.Constants.currentUser, username, {path: '/'});
                    if($rootScope.location != undefined) {
                        localStorageService.cookie.remove(Poc.Common.Constants.location);
                        localStorageService.cookie.set(Poc.Common.Constants.location, {name: $rootScope.location.display, uuid: $rootScope.location.uuid}, 7);
                        deferrable.resolve();
                    } else {
                        self.destroy();
                        deferrable.reject('LOGIN_LABEL_LOGIN_ERROR_NO_DEFAULT_LOCATION');
                    }
                } else {
                   deferrable.reject('LOGIN_LABEL_LOGIN_ERROR_FAIL_KEY');
                }
            }).error(function(){
                deferrable.reject('LOGIN_LABEL_LOGIN_ERROR_FAIL_KEY');
            });
            return deferrable.promise;
        };

        this.get = function () {
            return $http.get(sessionResourcePath, { cache: false });
        };

        this.loadCredentials = function () {
            var deferrable = $q.defer();
            var currentUser = $cookies.get(Bahmni.Common.Constants.currentUser);
            if(!currentUser) {
                this.destroy().then(function() {
                    $rootScope.$broadcast('event:auth-loginRequired');
                    deferrable.reject('LOGIN_LABEL_LOGIN_ERROR_NO_SESSION_USER_KEY')
                });
                return deferrable.promise;
            }
            userService.getUser(currentUser).success(function(data) {
                userService.getProviderForUser(data.results[0].uuid).success(function(providers){
                        if(!_.isEmpty(providers.results) && hasAnyActiveProvider(providers.results)){
                            $rootScope.currentUser = new Bahmni.Auth.User(data.results[0]);
                            $rootScope.$broadcast('event:user-credentialsLoaded', data.results[0]);
                            deferrable.resolve(data.results[0]);
                        }else{
                            self.destroy();
                            deferrable.reject('LOGIN_LABEL_LOGIN_ERROR_NOT_PROVIDER');
                        }
                    }
                ).error(function(){
                        self.destroy();
                        deferrable.reject('LOGIN_LABEL_LOGIN_ERROR_NO_PROVIDER');
                    });
            }).error(function () {
                self.destroy();
                deferrable.reject('LOGIN_LABEL_LOGIN_ERROR_NO_ROLES');
            });
            return deferrable.promise;
        };

        this.loadProviders = function(userInfo) {
            return $http.get("/openmrs/ws/rest/v1/provider", {
                 method: "GET",
                 params: {
                     user: userInfo.uuid
                 },
                 cache: false
             }).success(function (data) {
                var providerUuid = (data.results.length > 0) ? data.results[0].uuid : undefined;
                $rootScope.currentProvider = { uuid: providerUuid };
             });
        };
    }]).factory('authenticator', ['$rootScope', '$q', 'sessionService', function ($rootScope, $q, sessionService) {
        var authenticateUser = function () {
            var defer = $q.defer();
            var sessionDetails = sessionService.get();
            sessionDetails.success(function (data) {
                if (data.authenticated) {
                    defer.resolve();
                } else {
                    defer.reject('User not authenticated');
                    $rootScope.$broadcast('event:auth-loginRequired');
                }
            });
            sessionDetails.error(function(data){
                defer.reject('User not authenticated');
                $rootScope.$broadcast('event:auth-loginRequired');
            });
            return defer.promise;
        }

        return {
            authenticateUser: authenticateUser
        }

    }]).directive('logOut',['sessionService', '$window', function(sessionService, $window) {
        return {
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    scope.$apply(function() {
                        sessionService.destroy().then(
                            function () {
                                $window.location = "../home/#/login";
                            }
                        );
                    });
                });
            }
        };
    }])
    .directive('btnUserInfo', ['$rootScope', '$window', function($rootScope, $window) {
        return {
            restrict: 'CA',
            link: function(scope, elem, attrs) {
                elem.bind('click', function(event) {
                    $(this).next().toggleClass('active');
                    event.stopPropagation();
                });
                $(document).find('body').bind('click', function() {
                    $(elem).next().removeClass('active');
                });
            }
        };
    }
]);
