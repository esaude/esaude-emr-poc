'use strict';

angular.module('clinic')
        .controller('PatientHeaderController', ["$rootScope", "$stateParams", 
                        "patientService", "openmrsPatientMapper", 
                    function ($rootScope, $stateParams, patientService, patientMapper) {
            var patientUuid;
    
            (function () {
                patientUuid = $stateParams.patientUuid;
                
                var searchPromise = patientService.get(patientUuid);

                searchPromise.success(function (data) {
                    $rootScope.patient = patientMapper.map(data);
                });
                
                searchPromise['finally'](function () {
                });
            })();
        }]);
