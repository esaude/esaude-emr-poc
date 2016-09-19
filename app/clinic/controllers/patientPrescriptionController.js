'use strict';

angular.module('clinic')
        .controller('PatientPrescriptionController', ["$scope", "$rootScope", "$stateParams", 
                        "encounterService", "observationsService", "commonService", "conceptService", "localStorageService",
                    function ($scope, $rootScope, $stateParams, encounterService, 
                    observationsService, commonService, conceptService, localStorageService) {
        var patientUuid;
        var markedOn = "488e6803-c7db-43b2-8911-8d5d2a8472fd";
        var dateUtil = Bahmni.Common.Util.DateUtil;
        $scope.showMessages = false;

        var init = function() {
            patientUuid = $stateParams.patientUuid;
            $scope.listedPrescriptions = [];
            $scope.existingPrescriptions = [];
            
            $scope.fieldModels = angular.copy(Bahmni.Common.Constants.drugPrescriptionConvSet);
            
            conceptService.get(Bahmni.Common.Constants.prescriptionConvSetConcept).success(function (data) {
                for (var key in $scope.fieldModels) {
                    var fieldModel = $scope.fieldModels[key];
                    var foundModel = _.find(data.setMembers, function (element) {
                        return element.uuid === fieldModel.uuid;
                    });
                    fieldModel.model = foundModel;
                }
            });
            var encounterType = ($rootScope.patient.age.years >= 15) ? Bahmni.Common.Constants.adultFollowupEncounterUuid : 
                        Bahmni.Common.Constants.childFollowupEncounterUuid;
                
            loadSavedPrescriptions(patientUuid, encounterType);
                
        };
        
        var resetFieldModel = function () {
            for (var key in $scope.fieldModels) {
                $scope.fieldModels[key].value = undefined;
            }
        };
        
        $scope.add = function (valid) {
            if (!valid) {
                $scope.showMessages = true;
                return;
            }
            $scope.listedPrescriptions.push(angular.copy($scope.fieldModels));
            resetFieldModel();
            $scope.showNewPrescriptionsControlls = true;
            $scope.showMessages = false;
            $scope.fieldType = undefined;
        };
        
         $scope.remove = function (item) {
             _.pull($scope.listedPrescriptions, item);
             isPrescriptionControl();
         };
         
         $scope.edit = function (item) {
             $scope.fieldModels = angular.copy(item);
             _.pull($scope.listedPrescriptions, item);
             isPrescriptionControl();
         }
         
         var isPrescriptionControl = function () {
             if (_.isEmpty($scope.listedPrescriptions)) {
                 $scope.showNewPrescriptionsControlls = false;
             }
         }
        
        $scope.save = function () {
            //build obs
            var obs = [];
            var datetime = dateUtil.now();
            
            _.forEach($scope.listedPrescriptions, function (element) {
                //create group observation
                var obsConvSetGroup = {
                    concept: Bahmni.Common.Constants.prescriptionConvSetConcept,
                    obsDatetime: datetime,
                    person: patientUuid,
                    groupMembers: []
                };
                //create obs for grouped fields
                for (var key in element) {
                    var field = element[key];
                    
                    if (_.isUndefined(field.value)) continue;
                    
                    var observations = {
                        concept: field.model.uuid,
                        obsDatetime: datetime,
                        person: patientUuid,
                    };
                    //check if field has answers
                    if (!_.isEmpty(field.model.answers)) {
                        observations.value = field.value.uuid;
                    } else {
                        observations.value = field.value;
                    }
                    obsConvSetGroup.groupMembers.push(observations);
                }
                obs.push(obsConvSetGroup);
            });
            //create obs for markedOn
            var markedOnObs = {
                concept: markedOn,
                obsDatetime: datetime,
                person: patientUuid,
                value: dateUtil.getDateInDatabaseFormat(datetime)
            };
            obs.push(markedOnObs);
            //build new encounter
            var encounter = {
                encounterType: ($rootScope.patient.age.years >= 15) ? Bahmni.Common.Constants.adultFollowupEncounterUuid : 
                        Bahmni.Common.Constants.childFollowupEncounterUuid,
                form: ($rootScope.patient.age.years >= 15) ? Bahmni.Common.Constants.followupAdultFormUuid : 
                        Bahmni.Common.Constants.followupChildFormUuid,
                encounterDatetime: datetime,
                location: localStorageService.cookie.get("emr.location").uuid,
                patient: patientUuid,
                provider: $rootScope.currentUser.person.uuid,
                obs: obs
            };
            
            encounterService.create(encounter).success(encounterSuccessCallback);
        };
        
        var encounterSuccessCallback = function (encounterProfileData) {
            loadSavedPrescriptions(encounterProfileData.patient.uuid, encounterProfileData.encounterType.uuid);
            $scope.listedPrescriptions = [];
        };
        
        var loadSavedPrescriptions = function (patient, encounterType) {
            encounterService.getEncountersForEncounterType(patient, encounterType).success(function (data) {
                    $scope.existingPrescriptions = [];
                    var nonVoidedEncounters = encounterService.filterRetiredEncoounters(data.results);
                    var sortedEncounters = _.sortBy(nonVoidedEncounters, function (encounter) {
                        return moment(encounter.encounterDatetime).toDate();
                    }).reverse();
                    var filteredEncounters = _.filter(sortedEncounters, function (e) {
                        var foundObs = _.find(e.obs, function (o) {
                            return o.concept.uuid === markedOn;
                        });
                        return typeof foundObs !== "undefined";
                    });
                    //create model for existing encounters
                    _.forEach(filteredEncounters, function (encounter) {
                        var existingModels = {
                            prescriptionDate: null,
                            models: []
                        };
                        //find markedOn concept
                        var markedOnInfo = _.find(encounter.obs, function (o) {
                            return o.concept.uuid === markedOn;
                        });
                        existingModels.prescriptionDate = markedOnInfo.value;
                        
                        var existingPrescriptionSets = _.filter(encounter.obs, function (o) {
                            return o.concept.uuid === Bahmni.Common.Constants.prescriptionConvSetConcept;
                        });
                        
                        _.forEach(existingPrescriptionSets, function (pSet) {
                            var existingModel = angular.copy(Bahmni.Common.Constants.drugPrescriptionConvSet);
                            for (var key in existingModel) {
                                var m = existingModel[key];
                                var foundModel = _.find(pSet.groupMembers, function (element) {
                                    return element.concept.uuid === m.uuid;
                                });
                                if (_.isUndefined(foundModel)) continue;
                                
                                m.model = foundModel.concept;
                                m.value = foundModel.value;
                            }
                            existingModels.models.push(existingModel);
                        });
                        $scope.existingPrescriptions.push(existingModels);
                    });
            });
        };
        
        $scope.selectDrugType = function () {
            if ($scope.fieldType === "ARV") {
                $scope.isArt = true;
                $scope.isOthers = false;
            } else {
                $scope.isArt = false;
                $scope.isOthers = true;
            }
        };
        
        init();
    }]);
