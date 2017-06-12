'use strict';

angular.module('registration')
        .controller('ServicesListController', ['$rootScope', '$scope', '$stateParams', '$location', 'patientService',
                    function ($rootScope, $scope, $stateParams, $location, patientService) {

            var patientUuid;

            (function () {
                patientUuid = $stateParams.patientUuid;

                var searchPatientPromise = patientService.getPatient(patientUuid);

                searchPatientPromise.then(function (patient) {
                    $rootScope.patient = patient;
                });

                searchPatientPromise['finally'](function () {
                });
            })();

            $scope.linkDashboard = function() {
                $location.url("/dashboard/" + $scope.patient.uuid); // path not hash
            };
        }]);
