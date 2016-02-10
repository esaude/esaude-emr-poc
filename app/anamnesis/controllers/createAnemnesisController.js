'use strict';

angular.module('anamnesis')
    .controller('AnamnesisController', ['$stateParams', '$scope', '$state',  '$location', 'spinner', 'patientAttributeService', 'formService',
        function ($stateParams, $scope, $state, $location, spinner, patientAttributeService, formService) {
                
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
                
        }]);
