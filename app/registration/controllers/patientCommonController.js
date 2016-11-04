'use strict';

angular.module('registration')
    .controller('PatientCommonController', ['$scope', '$http', '$state', 'patientAttributeService', 'patientService', 'localStorageService', 'spinner',
        function ($scope, $http, $state, patientAttributeService, patientService, localStorageService, spinner) {

                var dateUtil = Bahmni.Common.Util.DateUtil;

                (function () {
                    $scope.showMessages = false;
                    $scope.today = dateUtil.getDateWithoutTime(dateUtil.now());
                    //get patient identifier types
                    var searchPromise = patientService.getIdentifierTypes();

                    searchPromise.success(function (data) {
                        $scope.patientIdentifierTypes = data.results;
                    });
                    searchPromise['finally'](function () {
                    });
                    spinner.forPromise(searchPromise);
                })();

                $scope.listRequiredIdentifiers = function () {
                    if (!_.isEmpty($scope.patient.identifiers)) {
                        return;
                    }-
                    patientService.getIdentifierTypes().success(function (data) {
                        $scope.patientIdentifierTypes = data.results;
                        _.forEach (data.results, function (value) {
                            if (value.required) {
                                var fieldName = value.name.trim().replace(/[^a-zA-Z0-9]/g, '');
                                $scope.patient.identifiers.push({identifierType: value,
                                    identifier: null, preferred: false,
                                    location: localStorageService.cookie.get("emr.location").uuid,
                                    fieldName : fieldName});
                            }
                        });
                    });
                };


                $scope.selectIdentifierType = function () {

                    $scope.errorMessage = null;

                    var patientIdentifierType = $scope.patient.patientIdentifierType;
                    if (patientIdentifierType !== null) {
                        //validate already contained
                        var found = _.find($scope.patient.identifiers, function (chr) {
                            return chr.identifierType.display === patientIdentifierType.display;
                        });

                        if(found === undefined) {
                            var fieldName = patientIdentifierType.name.trim().replace(/[^a-zA-Z0-9]/g, '');

                            if( fieldName == "BILHETEDEIDENTIDADEBI" ) {
                              $scope.patient.identifiers.push({identifierType: patientIdentifierType,
                                identifier: null, preferred: false,
                                location: localStorageService.cookie.get("emr.location").uuid,
                                fieldName : fieldName,
                                uimask: "(9999999999999-A)",
                                uimaskplaceholderchar:"_"
                                });

                            } else if ( fieldName == "NIDSERVICOTARV") {
                              $scope.patient.identifiers.push({identifierType: patientIdentifierType,
                                identifier: null, preferred: false,
                                location: localStorageService.cookie.get("emr.location").uuid,
                                uimask: "(99999999/99/99999)",
                                uimaskplaceholderchar:"_",
                                fieldName : fieldName});
                            } else {
                              $scope.patient.identifiers.push({identifierType: patientIdentifierType,
                                identifier: null, preferred: false,
                                location: localStorageService.cookie.get("emr.location").uuid,
                                fieldName : fieldName
                              });
                            }


                        } else {
                            $scope.errorMessage = "PATIENT_INFO_IDENTIFIER_ERROR_EXISTING";
                        }
                    }
                };

                $scope.removeIdentifier = function (identifier) {
                    $scope.errorMessage = null;

                    _.pull($scope.patient.identifiers, identifier);
                };

                $scope.setPreferredId = function (identifier) {
                    angular.forEach($scope.patient.identifiers, function (p) {
                        p.preferred = false; //set them all to false
                    });
                    identifier.preferred = true; //set the clicked one to true
                };

                $scope.stepForward = function (sref, validity) {
                    if (validity) {
                        $scope.showMessages = false;
                        $state.go($scope.srefPrefix + sref);
                    } else {
                        $scope.showMessages = true;
                    }
                };

                $scope.getAutoCompleteList = function (attributeName, query, type) {
                    return patientAttributeService.search(attributeName, query, type);
                };

                $scope.getDataResults = function (data) {
                    return  data.results;
                };

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
        }]);
