'use strict';

angular.module('registration')
    .controller('UpdatePatientController', ['$scope', '$location', '$stateParams', 'patientService', 
                    '$http', 'openmrsPatientMapper',
        function ($scope, $location, $stateParams, patientService, $http, patientMapper) {

                (function () {
                    $scope.srefPrefix = "editpatient.";
                    
                    var uuid = $stateParams.patientUuid;
                    
                    patientService.get(uuid).success(function (openmrsPatient) {
                        $scope.openMRSPatient = openmrsPatient;
                        $scope.patient = patientMapper.map(openmrsPatient);
                    });
                })();
                
                $scope.save = function () {
                    patientService.update($scope.patient, $scope.openMRSPatient).success(successCallback);
                };

            var successCallback = function (patientProfileData) {
                $scope.patient.uuid = patientProfileData.patient.uuid;
                $scope.patient.name = patientProfileData.patient.person.names[0].display;
                $scope.patient.isNew = true;
                $location.url("/dashboard/" + $scope.patient.uuid);
            };
        }]);
