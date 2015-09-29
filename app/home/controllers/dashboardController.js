'use strict';

angular.module('home')
        .controller('DashboardController', ['$scope', 'applicationServiceMock', function ($scope, applicationServiceMock) {
            init();

            function init() {

                var appsJson = {};
                applicationServiceMock.getApps().then(function (appJson) {
                    $scope.apps = eval(appJson.applications);
                });
            }

            $scope.linkApp = function (url) {
                document.location = url;
            };

            $scope.barLabels = ['1st', '2nd', '3rd', '4th', '5th', 'Yest', 'Today'];
            $scope.barSeries = ['Created', 'Updated', 'Removed'];

            $scope.barData = [
                [65, 59, 80, 81, 56, 55, 40],
                [28, 48, 40, 19, 86, 27, 90],
                [28, 48, 40, 19, 86, 27, 90]
            ];

            $scope.pieLabels = ["Created Records", "Updated Records", "Removed Revords"];
            $scope.pieData = [500, 300, 100];
            $scope.pieSeries = ['Created', 'Updated', 'Removed'];

        }]);
