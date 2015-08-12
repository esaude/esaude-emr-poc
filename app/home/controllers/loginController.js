'use strict';

angular.module('home')
    .controller('LoginController', ['$rootScope', '$scope', '$location', 
                'authenticationService', '$q',
        function ($rootScope, $scope, $location, authenticationService, $q) {
        var landingPagePath = "/dashboard";
        var loginPagePath = "/login";
        
        init();
        
        function init () {
            $scope.showMenu = true;
            $scope.loginUser = {};
        }
        
        var redirectToLandingPageIfAlreadyAuthenticated = function () {
            authenticationService.get().success(function (data) {
                if (data.authenticated) {
                    $location.path(landingPagePath);
                }
            });
        };
        
        if ($location.path() === loginPagePath) {
            redirectToLandingPageIfAlreadyAuthenticated();
        }
        
        $scope.login = function () {
//            $scope.errorMessage = null;
            $scope.dataLoading = true;
            var deferrable = $q.defer();
            authenticationService.loginUser($scope.loginUser.username, $scope.loginUser.password).then(
                function () {
                    authenticationService.loadCredentials().then(
                        function () {
                            $rootScope.$broadcast('event:auth-loggedin');
                            deferrable.resolve();
                        },
                        function (error) {
                            $scope.errorMessage = error;
                            $scope.dataLoading = false;
                            deferrable.reject(error);
                        }
                    )
                },
                function (error) {
                    $scope.errorMessage = error;
                    deferrable.reject(error);
                }
            );
            deferrable.promise['finally'](function() {
                $location.path(landingPagePath);
            });
    
        }
        // reset login status
//        authenticationService.clearCredentials();
// 
//        $scope.login = function () {
//            $scope.dataLoading = true;
//            authenticationService.login($scope.loginUser.username, $scope.loginUser.password, function(response) {
//                if(response.success) {
//                    authenticationService.setCredentials($scope.loginUser.username, $scope.loginUser.password);
//                    $location.url('/dashboard');
//                } else {
//                    $scope.error = response.message;
//                    $scope.dataLoading = false;
//                }
//            });
//        };
    }]);
