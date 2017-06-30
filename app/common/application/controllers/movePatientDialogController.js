'use strict';

angular.module('application')
        .controller('MovePatientDialogController', ['$rootScope', '$scope', '$window', 'applicationService',
                    'localStorageService', 'spinner',
            function ($rootScope, $scope, $window, applicationService,
                        localStorageService, spinner) {

            function init() {
                return applicationService.getApps().then(function (apps) {
                    $scope.apps = apps;
                });
            };

            $scope.linkApp = function (url) {
                localStorageService.set('movingPatient', $scope.$parent.patient.uuid);
                $window.location.href = url;
            };

            init();

        }]);
