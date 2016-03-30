'use strict';

angular.module('serviceform')
        .controller('ClinicalServiceController', ["$rootScope", "$scope", "$location", "$stateParams", 
                    function ($rootScope, $scope, $location, $stateParams) {
            var patientUuid;
    
            init();
    
            function init() {
                patientUuid = $stateParams.patientUuid;
            }
            
            $rootScope.linkServiceAdd = function(service) {
                $rootScope.postAction = "create";
                
                findFormInfo(service);
                
                $rootScope.formPayload = Poc.Common.FormRequestMapper
                        .mapFromOpenMRSForm($scope.serviceForms[service.formId]);
                
                $location.url(service.url + "/" + patientUuid + "/" + 
                        service.formId + $scope.formInfo.parts[0].sref.replace(".", "/"));
            };
            
            $rootScope.linkServiceEdit = function(service, encounter) {
                $rootScope.postAction = "edit";
                
                findFormInfo(service);
                
                $rootScope.formPayload = Poc.Common.FormRequestMapper
                        .mapFromOpenMRSFormWithEncounter($scope.serviceForms[service.formId], encounter);
                
                $location.url(service.url + "/" + patientUuid + "/" + 
                        service.formId + $scope.formInfo.parts[0].sref.replace(".", "/"));
            };
            
            var findFormInfo = function (service) {
                $rootScope.formInfo = _.find($scope.formLayout, function(data) {
                    return data.formId === service.formId; 
                });
            };
            
        }]);
