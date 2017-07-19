'use strict';

angular.module('registration')
    .controller('PatientCommonController', ['$scope', '$http', '$state', 'patientAttributeService', 'patientService', 'localStorageService', 'spinner',
        function ($scope, $http, $state, patientAttributeService, patientService, localStorageService, spinner) {

                var dateUtil = Bahmni.Common.Util.DateUtil;

                var vm = this;
                vm.patient = $scope.patient;

                (function () {
                    vm.showMessages = false;
                    vm.today = dateUtil.getDateWithoutTime(dateUtil.now());
                    //get patient identifier types
                    var searchPromise = patientService.getIdentifierTypes();

                    searchPromise.success(function (data) {
                        vm.patientIdentifierTypes = data.results;
                    });
                    searchPromise['finally'](function () {
                    });
                    spinner.forPromise(searchPromise);
                })();

                vm.listRequiredIdentifiers = function () {
                    if (!_.isEmpty(vm.patient.identifiers)) {
                        //set identifier fieldName
                        _.forEach (vm.patient.identifiers, function (identifier) {
                            var fieldName = identifier.identifierType.display.trim().replace(/[^a-zA-Z0-9]/g, '');
                            identifier.fieldName = fieldName;
                        });
                        return;
                    }-
                    patientService.getIdentifierTypes().success(function (data) {
                        vm.patientIdentifierTypes = data.results;
                        _.forEach (data.results, function (value) {
                            if (value.required) {
                                var fieldName = value.name.trim().replace(/[^a-zA-Z0-9]/g, '');
                                vm.patient.identifiers.push({identifierType: value,
                                    identifier: null, preferred: false,
                                    location: localStorageService.cookie.get("emr.location").uuid,
                                    fieldName : fieldName});
                            }
                        });
                    });
                };


                vm.selectIdentifierType = function () {

                    vm.errorMessage = null;

                    var patientIdentifierType = vm.patient.patientIdentifierType;
                    if (patientIdentifierType !== null) {
                        //validate already contained
                        var found = _.find(vm.patient.identifiers, function (chr) {
                            return chr.identifierType.display === patientIdentifierType.display;
                        });

                        if(found === undefined) {
                            var fieldName = patientIdentifierType.name.trim().replace(/[^a-zA-Z0-9]/g, '');

                            vm.patient.identifiers.push({identifierType: patientIdentifierType,
                                identifier: null, preferred: false,
                                location: localStorageService.cookie.get("emr.location").uuid,
                                fieldName : fieldName
                            });

                        } else {
                            vm.errorMessage = "PATIENT_INFO_IDENTIFIER_ERROR_EXISTING";
                        }
                    }
                };

                vm.removeIdentifier = function (identifier) {
                    vm.errorMessage = null;

                    _.pull(vm.patient.identifiers, identifier);
                };

                vm.setPreferredId = function (identifier) {
                    angular.forEach(vm.patient.identifiers, function (p) {
                        if (p.identifierType.uuid !== identifier.identifierType.uuid) {
                            p.preferred = false; //set them all to false
                        }
                    });
                };

                vm.stepForward = function (sref, validity) {
                    if (validity) {
                        vm.showMessages = false;
                        $state.go(vm.srefPrefix + sref);
                    } else {
                        vm.showMessages = true;
                    }
                };

                vm.getAutoCompleteList = function (attributeName, query, type) {
                    return patientAttributeService.search(attributeName, query, type);
                };

                vm.getDataResults = function (data) {
                    return  data.results;
                };

                vm.getDeathConcepts = function () {
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
                                vm.deathConcepts = results.data.results[0]!=null ? results.data.results[0].answers:[];
                                vm.deathConcepts = filterRetireDeathConcepts(vm.deathConcepts);
                            });
                        }]
                    });
                };

                var filterRetireDeathConcepts = function(deathConcepts){
                    return _.filter(deathConcepts,function(concept){
                        return !concept.retired;
                    });
                };

                vm.selectIsDead = function(){
                    if(vm.patient.causeOfDeath != null ||vm.patient.deathDate != null){
                        vm.patient.dead = true;
                    }
                };

                vm.disableIsDead = function(){
                    return (vm.patient.causeOfDeath != null || vm.patient.deathDate != null) && vm.patient.dead;
                };
        }]);
