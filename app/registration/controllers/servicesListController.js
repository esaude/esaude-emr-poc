'use strict';

angular.module('registration')
        .controller('ServicesListController', ['$rootScope', '$scope', '$stateParams', '$location', 'patientService', 'openmrsPatientMapper',
                    function ($rootScope, $scope, $stateParams, $location, patientService, patientMapper) {
            
            var patientUuid;
    
            (function () {
                patientUuid = $stateParams.patientUuid;
                
                var searchPatientPromise = patientService.get(patientUuid);

                searchPatientPromise.success(function (data) {
                    $rootScope.patient = patientMapper.map(data);
                });
                
                searchPatientPromise['finally'](function () {
                });
            })();
            
            $scope.linkDashboard = function() {
                $location.url("/dashboard/" + $scope.patient.uuid); // path not hash
            };
        }]);
