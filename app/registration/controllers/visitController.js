'use strict';

angular.module('registration')
        .controller('VisitController', ['$rootScope', '$scope', '$stateParams', '$location', 'visitService', 'encounterService',
                    function ($rootScope, $scope, $stateParams, $location, visitService, encounterService) {
            var patientUuid;
    
            init();
    
            function init() {
                patientUuid = $stateParams.patientUuid;
                
                visitService.search({patient: patientUuid, 
                    v: 'custom:(visitType,startDatetime,stopDatetime,uuid,encounters)'})
                .success(function (data) {          
                    $scope.lastVisit = _.maxBy(data.results, 'startDatetime');
                });
                
                encounterService.getEncountersForEncounterType(patientUuid, 
                    ($scope.patient.age.years >= 15) ? $rootScope.encounterTypes.followUpAdult : 
                                                                $rootScope.encounterTypes.followUpChild)
                            .success(function (data) {
                                var last = _.maxBy(data.results, 'encounterDatetime');
                                if (!last) return;
                                $scope.lastConsultation = last;
                                $scope.nextConsultation = _.find(last.obs, function (o) {
                                    return o.concept.uuid === "e1dae630-1d5f-11e0-b929-000c29ad1d07";
                                });
                            }
                );
        
                encounterService.getEncountersForEncounterType(patientUuid, $rootScope.encounterTypes.pharmacy)
                            .success(function (data) {
                                var last = _.maxBy(data.results, 'encounterDatetime');
                                if (!last) return;
                                $scope.lastPharmacy = last;
                                $scope.nextPharmacy = _.find(last.obs, function (o) {
                                    return o.concept.uuid === "e1e2efd8-1d5f-11e0-b929-000c29ad1d07";
                                });
                            }
                );
            }
        }]);
