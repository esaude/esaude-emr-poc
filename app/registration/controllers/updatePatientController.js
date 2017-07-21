'use strict';

angular.module('registration')
    .controller('UpdatePatientController', ['$scope', '$location', '$stateParams', 'patientService',
        function ($scope, $location, $stateParams, patientService) {

                (function () {
                    $scope.srefPrefix = "editpatient.";
                    var uuid = $stateParams.patientUuid;

                    patientService.getOpenMRSPatient(uuid).then(function (patient) {
                        $scope.openMRSPatient = patient;
                    });
                })();

                $scope.save = function () {
                    patientService.update($scope.patient, $scope.openMRSPatient).success(successCallback);
                };

            var successCallback = function (patientProfileData) {
                //update patient identifier
                _.forEach (patientProfileData.patient.identifiers, function (oldIdentifier) {
                    var found = _.find ($scope.patient.identifiers, function (identifier) {
                        return identifier.identifierType.uuid === oldIdentifier.identifierType.uuid;
                    });

                    if (_.isUndefined(found)) {

                    } else {
                        //check if value was changed
                        if (found.identifier !== oldIdentifier.identifier) {
                            patientService.updatePatientIdentifier(patientProfileData.patient.uuid, oldIdentifier.uuid,
                                {identifier: found.identifier, uuid: oldIdentifier.uuid, preferred: found.preferred}).success(successIdentifierCallback);
                        }
                    }
                });
                $scope.patient.uuid = patientProfileData.patient.uuid;
                $scope.patient.name = patientProfileData.patient.person.names[0].display;
                $scope.patient.isNew = false;
                $location.url("/dashboard/" + $scope.patient.uuid);
            };

            var successIdentifierCallback = function (identifierProfileData) {
                var foundIdentifier = _.find($scope.patient.identifiers, function (identifier) {
                    return identifier.uuid === identifierProfileData.uuid;
                });

                foundIdentifier.identifier = identifierProfileData.identifier;
                foundIdentifier.preferred = identifierProfileData.preferred;

            }
        }]);
