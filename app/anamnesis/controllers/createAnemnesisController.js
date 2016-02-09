'use strict';

angular.module('anamnesis')
    .controller('AnamnesisController', ['$q', '$scope', '$state',  '$location', 'spinner', 'patientAttributeService', 'formService',
        function ($q, $scope, $state, $location, spinner, patientAttributeService, formService) {
                
                (function () {

                    $scope.formInfo = {};
                    $scope.formInfo.formFieldParts = [];
                    $scope.formInfo.uuid = Poc.Anamnesis.Constants.anamnesisAAdultForm,
                    $scope.formInfo.formFieldParts.referencePerson =
                        {
                            name:       "11b3ea5f-8128-4281-8c21-86450e654141",
                            surname:    "db8a0e20-9089-41d5-89d7-b83c3ff3f7cc",
                            contact:    "58e7df4d-c8c3-4cd9-a533-1bd120839d99"
                        },
                    $scope.formInfo.formFieldParts.personalInfo =
                        {
                            educationLevel: "ae176223-ac8c-4ba1-8dfa-3b5c70ea9490"
                        };
                        
                    formService.fetchByUuid(Poc.Anamnesis.Constants.anamnesisAAdultForm)
                        .success(function (data) {
                            $scope.formPayload = Poc.Common.FormRequestMapper.mapFromOpenMRSForm(data);
                            console.log($scope.formPayload);
                        });
                    
                })();
                        
                $scope.getAutoCompleteList = function (attributeName, query, type) {
                    return patientAttributeService.search(attributeName, query, type);
                };

                $scope.getDataResults = function (data) {
                    return  data.results;
                };
                
        }]);
