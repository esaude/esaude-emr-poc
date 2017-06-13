'use strict';

angular.module('common.patient')
        .controller('PatientHeaderController', ["$rootScope", "$stateParams",
                        "patientService",
                    function ($rootScope, $stateParams, patientService) {
            var patientUuid;

            (function () {
                patientUuid = $stateParams.patientUuid;

                patientService.getPatient(patientUuid).then(function (patient) {
                    $rootScope.patient = patient;
                });

            })();
        }]);
