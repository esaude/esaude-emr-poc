'use strict';

angular.module('anamnesis')
    .controller('AnamnesisController', ['$rootScope', 'localStorageService','$stateParams', '$scope', '$state',  '$location', 'spinner', 'patientAttributeService', 'formService', 'encounterService',
        function ($rootScope, localStorageService, $stateParams, $scope, $state, $location, spinner, patientAttributeService, formService, encounterService) {
                
                (function () {
                    $scope.submitted = false;
                    $scope.visitedFields = [];
                    
                    var formUuid = $stateParams.formUuid;
                    
                    $scope.formInfo = _.find($scope.forms, function (form) {
                        return form.formId === formUuid;
                    });
                    
                    var currentSref = $state.current.url.replace("/", ".");
                    
                    $scope.currentFormPart = _.find($scope.formInfo.parts, function (formPart) {
                        return formPart.sref === currentSref;
                    });
                        
                    formService.fetchByUuid(Poc.Anamnesis.Constants.anamnesisAAdultForm)
                        .success(function (data) {
                            $scope.formPayload = Poc.Common.FormRequestMapper.mapFromOpenMRSForm(data);
                            console.log($scope.formPayload);
                        });
                    
                })();
                
                $scope.stepInFormPart = function(formPart) {
                    $scope.currentFormPart = formPart;
                };
                
                $scope.updateCurrentFormPart = function (nextSref, validity) {
                    if (validity) {
                        $scope.currentFormPart = _.find($scope.formInfo.parts, function (formPart) {
                            return formPart.sref === nextSref;
                        });
                        $scope.submitted = false;
                        $state.go(Poc.Anamnesis.Constants.anamnesisSref + nextSref);
                    } else {
                        $scope.submitted = true;
                    }
                };
                        
                $scope.getAutoCompleteList = function (attributeName, query, type) {
                    return patientAttributeService.search(attributeName, query, type);
                };

                $scope.getDataResults = function (data) {
                    return  data.results;
                };
                
                $scope.compactName = function (name) {
                    return name.trim().replace(/[^a-zA-Z0-9]/g, '');
                };
                
                $scope.save = function () {
                    var currDate = Bahmni.Common.Util.DateUtil.now();
                    var location = localStorageService.cookie.get("emr.location");
                    var encounterMapper = new Poc.Common.CreateEncounterRequestMapper(currDate);
                    
                    var openMRSEncounter = encounterMapper.mapFromFormPayload($scope.formPayload, 
                    $scope.formInfo.parts, 
                    $scope.patient.uuid,
                    location.uuid,
                    $rootScope.currentUser.person.uuid);//set date
                    encounterService.create(openMRSEncounter).success(successCallback);
                    console.log(openMRSEncounter);
                };
                
                var successCallback = function (encounterProfileData) {
                    console.log(encounterProfileData);
                };
                
        }]);
