'use strict';

angular.module('anamnesis')
    .controller('AnamnesisController', ['$rootScope', 'localStorageService','$stateParams', '$scope', '$state',  '$location', 'spinner', 'patientAttributeService', 'formService', 'encounterService',
        function ($rootScope, localStorageService, $stateParams, $scope, $state, $location, spinner, patientAttributeService, formService, encounterService) {
                
                (function () {
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
                
                $scope.updateCurrentFormPart = function (nextSref) {
                    
                    $scope.currentFormPart = _.find($scope.formInfo.parts, function (formPart) {
                        return formPart.sref === nextSref;
                    });
                    $state.go(Poc.Anamnesis.Constants.anamnesisSref + nextSref);
                };
                        
                $scope.getAutoCompleteList = function (attributeName, query, type) {
                    return patientAttributeService.search(attributeName, query, type);
                };

                $scope.getDataResults = function (data) {
                    return  data.results;
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
//                    console.log(openMRSEncounter);
                };
                
                var successCallback = function (patientProfileData) {
                    console.log(patientProfileData);
                };
                
        }]);
