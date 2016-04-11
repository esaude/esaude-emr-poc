'use strict';

angular.module('home')
        .controller('DashboardController', ['$filter', '$scope', '$window', 'applicationService', 
            function ($filter, $scope, $window, applicationService) {
            init();

            function init() {
                applicationService.getApps().then(function (appJson) {
                    $scope.apps = eval(appJson.applications);
                });
            }

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

        }]);
