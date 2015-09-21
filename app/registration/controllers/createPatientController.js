'use strict';

angular.module('registration')
    .controller('CreatePatientController', ['$scope', '$rootScope', '$state', 'patient', 'patientService', 'Preferences', 'spinner', 'appService', '$http', 'adminConfigService',
        function ($scope, $rootScope, $state, patientModel, patientService, preferences, spinner, appService, $http, adminConfigService) {
                var dateUtil = Bahmni.Common.Util.DateUtil;
                $scope.actions = {};
                $scope.patientIdentifiers = [];
                $scope.addressHierarchyConfigs = appService.getAppDescriptor().getConfigValue("addressHierarchy");

                (function () {
                    $scope.patient = patientModel.create();
                    //get patient identifier types
                    var searchPromise = patientService.getIdentifierTypes();

                    searchPromise.success(function (data) {
                        $scope.patientIdentifierTypes = data.results;
                    });
                    searchPromise['finally'](function () {
                    });
                })();

                $scope.selectIdentifierType = function () {
                    $scope.errorMessage = null;
                    
                    var patientIdentifierType = $scope.patient.patientIdentifierType;
                    if (patientIdentifierType !== null) {
                        //validate already contained
                        var found = _.find($scope.patientIdentifiers, function (chr) {
                            return chr.type.name === patientIdentifierType.name;
                        });
                        
                        if(found === undefined) {
                            var fieldName = patientIdentifierType.name.trim().replace(/[^a-zA-Z0-9]/g, '');
                            $scope.patientIdentifiers.push({type: patientIdentifierType, identifier: null, preferred: false, fieldName : fieldName});
                        } else {
                            $scope.errorMessage = "The selected Patient Identifier Type is already contained.";
                        }
                    }
                };

                $scope.removeIdentifier = function (identifier) {
                    $scope.errorMessage = null;
                    
                    _.pull($scope.patientIdentifiers, identifier);
                };

                $scope.setPreferredId = function (identifier) {
                    angular.forEach($scope.patientIdentifiers, function (p) {
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

                $scope.create = function () {
                setPreferences();
                var errMsg = Bahmni.Common.Util.ValidationUtil.validate($scope.patient,$scope.patientConfiguration.personAttributeTypes);
                if(errMsg){
//                    messagingService.showMessage('formError', errMsg);
                    return;
                }
                if($rootScope.newlyAddedRelationships && $rootScope.newlyAddedRelationships.length > 1) {
                    $rootScope.newlyAddedRelationships.shift();
                    $scope.patient.relationships = $rootScope.newlyAddedRelationships;
                }

                if (!$scope.hasOldIdentifier) {
                    spinner.forPromise(patientService.generateIdentifier($scope.patient)
                        .then(function (response) {
                            $scope.patient.identifier = response.data;
                            patientService.create($scope.patient).success(successCallback);
                        }));
                }
                else{
                    patientService.create($scope.patient).success(successCallback);
                }
            };

            var setPreferences = function () {
                preferences.identifierPrefix = $scope.patient.identifierPrefix.prefix;
            };

            var successCallback = function (patientProfileData) {
                $scope.patient.uuid = patientProfileData.patient.uuid;
                $scope.patient.name = patientProfileData.patient.person.names[0].display;
                $scope.patient.isNew = true;
                $scope.patient.registrationDate = dateUtil.now();
                $scope.actions.followUpAction(patientProfileData);
            };

            $scope.afterSave = function () {
//                messagingService.showMessage("info", "Saved");
//                $state.go("patient.edit", {patientUuid: $scope.patient.uuid});
            };

        }]).directive("dynamicName",function($compile){
        return {
            restrict:"A",
            terminal:true,
            priority:1000,
            link:function(scope,element,attrs){
                element.attr('name', scope.$eval(attrs.dynamicName));
                element.removeAttr("dynamic-name");
                $compile(element)(scope);
            }
        };
    });
