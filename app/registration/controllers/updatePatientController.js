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
                
                $scope.getDeathConcepts = function () {
                    var deathConcept;
                    var deathConceptValue;
                    $http({
                        url: '/openmrs/ws/rest/v1/systemsetting',
                        method: 'GET',
                        params: {
                            q: 'concept.causeOfDeath',
                            v: 'full'
                        },
                        withCredentials: true,
                        transformResponse: [function(data){
                            deathConcept = JSON.parse(data);
                            deathConceptValue = deathConcept.results[0].value;
                            $http.get(Bahmni.Common.Constants.conceptUrl, {
                                params: {
                                    q: deathConceptValue,
                                    v: 'custom:(uuid,name,set,answers:(uuid,display,name:(uuid,name),retired))'
                                },
                                withCredentials: true
                            }).then(function (results) {
                                $scope.deathConcepts = results.data.results[0]!=null ? results.data.results[0].answers:[];
                                $scope.deathConcepts = filterRetireDeathConcepts($scope.deathConcepts);
                            });
                        }]
                    });
                };
                
                var filterRetireDeathConcepts = function(deathConcepts){
                    return _.filter(deathConcepts,function(concept){
                        return !concept.retired;
                    });
                };
                
                $scope.selectIsDead = function(){
                    if($scope.patient.causeOfDeath != null ||$scope.patient.deathDate != null){
                        $scope.patient.dead = true;
                    }
                };

                $scope.disableIsDead = function(){
                    return ($scope.patient.causeOfDeath != null || $scope.patient.deathDate != null) && $scope.patient.dead;
                };
                
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
