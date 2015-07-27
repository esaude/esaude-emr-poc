'use strict';

angular.module('registration')
        .controller('DetailPatientController', function ($rootScope, $scope, $stateParams, $location, patientServiceMock) {
            var patientUuid;
    
            init();
    
            function init() {
                patientUuid = $stateParams.patientUuid;
                
                $rootScope.patient = patientServiceMock.getPatientByUuid(patientUuid);
            }
            
            $scope.linkDashboard = function() {
                $location.url("/dashboard/" + patientUuid); // path not hash
            };
        });
