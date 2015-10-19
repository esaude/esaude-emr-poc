'use strict';

angular.module('registration')
        .controller('DetailPatientController', ["$rootScope", "$scope", "$stateParams", "$location", "patientService", "openmrsPatientMapper",
                function ($rootScope, $scope, $stateParams, $location, patientService, patientMapper) {
            var patientUuid;
    
            (function () {
                patientUuid = $stateParams.patientUuid;
                
                var searchPatientPromise = patientService.get(patientUuid);

                searchPatientPromise.success(function (data) {
                    $rootScope.patient = patientMapper.map(data);
                    
                    var searchPatientIdentifiersPromise = patientService.getPatientIdentifiers(patientUuid);

                    searchPatientIdentifiersPromise.success(function (data) {
                        angular.forEach(data.results, function (value) {
                            $scope.patient.patientIdentifiers.push({type: {name: value.identifierType.display}, 
                                identifier: value.identifier, 
                                preferred: value.preferred});
                        });
                    });

                    searchPatientIdentifiersPromise['finally'](function () {
                    });
                });
                
                searchPatientPromise['finally'](function () {
                });
            })();
            
            $scope.initAttributes = function() {
                $scope.patientAttributes = [];
                angular.forEach($scope.patientConfiguration.customAttributeRows(), function (value) {
                    angular.forEach(value, function (value) {
                        $scope.patientAttributes.push(value);
                    });
                });
            };
            
            $scope.linkDashboard = function() {
                $location.url("/dashboard/" + patientUuid); // path not hash
            };
        }]);
