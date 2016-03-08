'use strict';

angular.module('registration')
        .controller('DashboardController', ["$rootScope", "$scope", "$location", "$state", "$stateParams", 
                        "patientService", "openmrsPatientMapper", 
                    function ($rootScope, $scope, $location, $state, $stateParams, patientService, patientMapper) {
            var patientUuid;
    
            init();
    
            function init() {
                patientUuid = $stateParams.patientUuid;
            }
            
            $scope.linkSearch = function() {
                $location.url("/search"); // path not hash
            };
            
            $scope.linkVisit = function() {
                $location.url("/visit/" + patientUuid); // path not hash
            };
            
            $scope.linkPatientDetail = function() {
                $location.url("/patient/detail/" + patientUuid + "/demographic"); // path not hash
            };
            
            $scope.linkServicesList = function() {
                $location.url("/services/" + patientUuid); // path not hash
            };
            
//            $rootScope.linkService = function(service) {
//                $rootScope.formInfo = _.find($scope.formLayout, function(data) {
//                    return data.formId === service.formId; 
//                });
//                
//                $location.url(service.url + "/" + patientUuid + "/" + 
//                        service.formId + $scope.formInfo.parts[0].sref.replace(".", "/"));
//            };
            
        }]);
