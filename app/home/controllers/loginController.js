'use strict';

angular.module('home')
    .controller('LoginController', ['$rootScope', '$scope', '$location', 'sessionService', 'spinner', '$q',
                '$stateParams', '$translate', 'localeService', '$window', '$route', 'esaudeConfigurations',
        function ($rootScope, $scope, $location, sessionService, spinner, $q, $stateParams, $translate, localeService, $window, $route, esaudeConfigurations) {
        var landingPagePath = "/dashboard";
        var loginPagePath = "/login";

        (function () {
            $scope.showMenu = true;
            $rootScope.loginUser = {};

            localeService.allowedLocalesList().then(function (response) {
                $scope.locales = response.data.replace(/\s+/g, '').split(',');
                $scope.selectedLocale = $translate.use()? $translate.use() : $scope.locales[0];
            });

        })();

        $scope.updateLocale = function (selectedLocale) {
            $translate.use(selectedLocale);
        };

        if ($stateParams.showLoginMessage) {
            $scope.errorMessageTranslateKey = "LOGIN_LABEL_LOGIN_ERROR_MESSAGE_KEY";
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
            $scope.errorMessageTranslateKey = null;
            $scope.dataLoading = true;
            var deferrable = $q.defer();
            sessionService.loginUser($scope.loginUser.username, $scope.loginUser.password).then(
                function () {
                    sessionService.loadCredentials().then(
                        function () {
                            $rootScope.$broadcast('event:auth-loggedin');
                            deferrable.resolve();
                        },
                        function (error) {
                            $scope.errorMessageTranslateKey = error;
                            $scope.dataLoading = false;
                            deferrable.reject(error);
                        }
                    )
                },
                function (error) {
                    $scope.errorMessageTranslateKey = error;
                    deferrable.reject(error);
                }
            );
            spinner.forPromise(deferrable.promise).then(
                function () {
                    $route.reload();
                    //$window.location.reload();
                    $location.path(landingPagePath);
                }
            );
        };

          $scope.initializeLocation = function () {
            esaudeConfigurations.loadDefaultLocation();
          };
    }]);
