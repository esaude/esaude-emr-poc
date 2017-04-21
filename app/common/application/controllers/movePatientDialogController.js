'use strict';

angular.module('application')
        .controller('MovePatientDialogController', ['$rootScope', '$scope', '$window', 'applicationService',
                    'localStorageService', 'spinner',
            function ($rootScope, $scope, $window, applicationService, 
                        localStorageService, spinner) {

            function init() {
                return applicationService.getApps().then(function (appJson) {
                    $scope.apps = eval(appJson.applications);
                });
            };

            $scope.linkApp = function (url) {
                localStorageService.set('movingPatient', $scope.$parent.patient.uuid);
                $window.location.href = url;
            };
            
            init();

        }]);
