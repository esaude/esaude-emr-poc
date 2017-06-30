'use strict';

angular.module('home')
        .controller('DashboardController', ['$rootScope', '$filter', '$scope', '$window', 'applicationService',
                    'configurations', 'locationService', 'localStorageService', 'spinner',
            function ($rootScope, $filter, $scope, $window, applicationService, configurations,
                        locationService, localStorageService, spinner) {

            function init() {
                applicationService.getApps().then(function (apps) {
                    $scope.apps = apps;
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

            $scope.barLabels = [$filter('translate')('USER_DASHBOARD_1'),
                $filter('translate')('USER_DASHBOARD_2'),
                $filter('translate')('USER_DASHBOARD_3'),
                $filter('translate')('USER_DASHBOARD_4'),
                $filter('translate')('USER_DASHBOARD_5'),
                $filter('translate')('USER_DASHBOARD_YEST'),
                $filter('translate')('USER_DASHBOARD_TODAY')];
            $scope.barSeries = [$filter('translate')('USER_DASHBOARD_CREATED'),
                $filter('translate')('USER_DASHBOARD_UPDATED'),
                $filter('translate')('USER_DASHBOARD_REMOVED')];

            $scope.barData = [
                [65, 59, 80, 81, 56, 55, 40],
                [28, 48, 40, 19, 86, 27, 90],
                [28, 48, 40, 19, 86, 27, 90]
            ];

            $scope.pieLabels = [$filter('translate')('USER_DASHBOARD_CREATED_RECORDS'),
                $filter('translate')('USER_DASHBOARD_UPDATED_RECORDS'),
                $filter('translate')('USER_DASHBOARD_REMOVED_RECORDS')];
            $scope.pieData = [500, 300, 100];
            $scope.pieSeries = [$filter('translate')('USER_DASHBOARD_CREATED'),
                $filter('translate')('USER_DASHBOARD_UPDATED'),
                $filter('translate')('USER_DASHBOARD_REMOVED')];

            return spinner.forPromise(init());

        }]);
