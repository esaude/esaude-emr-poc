'use strict';

angular.module('home')
    .controller('LoginController', ['$rootScope', '$scope', '$window', '$location', 'sessionService', 'spinner', '$q', 
                '$stateParams', 'locationService',
        function ($rootScope, $scope, $window, $location, sessionService, spinner, $q, $stateParams, locationService) {
        var landingPagePath = "/dashboard";
        var loginPagePath = "/login";
        
        (function () {
            $scope.showMenu = true;
            $rootScope.loginUser = {};
            
            var locationPromise = locationService.getAllByTag();
            
            locationPromise.success(function (data) {
                        $scope.locations = data.results;
                    });
                    locationPromise['finally'](function () {
                    });
            
        })();
        
        if ($stateParams.showLoginMessage) {
            $scope.errorMessage = "You are not authenticated or your session expired. Please login.";
        }
        
        var redirectToLandingPageIfAlreadyAuthenticated = function () {
            sessionService.get().success(function (data) {
                if (data.authenticated) {
                    $location.path(landingPagePath);
                }
            });
        };
        
        if ($location.path() === loginPagePath) {
            redirectToLandingPageIfAlreadyAuthenticated();
        }
        
        $scope.login = function () {
            $scope.errorMessage = null;
            $scope.dataLoading = true;
            var deferrable = $q.defer();
            sessionService.loginUser($scope.loginUser.username, $scope.loginUser.password, $scope.loginUser.currentLocation).then(
                function () {
                    sessionService.loadCredentials().then(
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
            spinner.forPromise(deferrable.promise).then(
                function () {
                    $location.path(landingPagePath);
                }
            );
        };
    }]);
