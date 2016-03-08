'use strict';

angular.module('registration')
    .controller('CreatePatientController', ['$rootScope', '$scope', '$state', '$location', 'patient', 'patientService', 
                    'spinner', 'appService', '$http', 'localStorageService', 'patientAttributeService',
        function ($rootScope, $scope, $state, $location, patientModel, patientService, spinner, appService, $http, localStorageService,
                    patientAttributeService) {
                var dateUtil = Bahmni.Common.Util.DateUtil;
                $scope.actions = {};
                $scope.addressHierarchyConfigs = appService.getAppDescriptor().getConfigValue("addressHierarchy");

                (function () {
                    $scope.showMessages = false;
                    $scope.patient = patientModel.create();
                    $scope.today = dateUtil.getDateWithoutTime(dateUtil.now());
                    //get patient identifier types
                    var searchPromise = patientService.getIdentifierTypes();

                    searchPromise.success(function (data) {
                        $scope.patientIdentifierTypes = data.results;
                    });
                    searchPromise['finally'](function () {
                    });
                    //list required identifier types
                    
                    
                })();
                
                $scope.listRequiredIdentifiers = function () {
                    if (!_.isEmpty($scope.patient.identifiers)) {
                        return;
                    }
                    _.forEach ($scope.patientIdentifierTypes, function (value) {
                        if (value.required) {
                            var fieldName = value.name.trim().replace(/[^a-zA-Z0-9]/g, '');
                            $scope.patient.identifiers.push({identifierType: value, 
                                identifier: null, preferred: false, 
                                location: localStorageService.cookie.get("emr.location").uuid, 
                                fieldName : fieldName});
                        }
                    });  
                };
                
                $scope.stepForward = function (sref, validity) {
                    if (validity) {
                        $scope.showMessages = false;
                        $state.go(sref);
                    } else {
                        $scope.showMessages = true;
                    }
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
                            $scope.patient.identifiers.push({identifierType: patientIdentifierType, 
                                identifier: null, preferred: false, 
                                location: localStorageService.cookie.get("emr.location").uuid, 
                                fieldName : fieldName});
                        } else {
                            $scope.errorMessage = "The selected Patient Identifier Type is already contained.";
                        }
                    }
                };
                
                $scope.getAutoCompleteList = function (attributeName, query, type) {
                    return patientAttributeService.search(attributeName, query, type);
                };
                
                $scope.getDataResults = function (data) {
                    return  data.results;
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
                
                $scope.initAttributes = function() {
                    $scope.patientAttributes = [];
                    angular.forEach($scope.patientConfiguration.customAttributeRows(), function (value) {
                        angular.forEach(value, function (value) {
                            $scope.patientAttributes.push(value);
                        });
                    });
                };
                
                $scope.create = function () {
                    var errMsg = Bahmni.Common.Util.ValidationUtil.validate($scope.patient,$scope.patientConfiguration.personAttributeTypes);
                    if(errMsg){
    //                   messagingService.showMessage('formError', errMsg);
                        return;
                    }

                    patientService.create($scope.patient).success(successCallback);
                };

            var successCallback = function (patientProfileData) {
                $scope.patient.uuid = patientProfileData.patient.uuid;
                $scope.patient.name = patientProfileData.patient.person.names[0].display;
                $scope.patient.isNew = true;
                $scope.patient.registrationDate = dateUtil.now();
                $location.url("/dashboard/" + $scope.patient.uuid);
            };

            $scope.afterSave = function () {
//                messagingService.showMessage("info", "Saved");
//                $state.go("patient.edit", {patientUuid: $scope.patient.uuid});
            };
        }]);
