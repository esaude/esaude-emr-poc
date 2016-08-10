'use strict';

angular.module('registration')
        .controller('ScheduleListController', ['$rootScope', '$scope', 'patientService', 
            'commonService', 'cohortService', 'openmrsPatientMapper', 'observationsService', 'visitService',
                    function ($rootScope, $scope, patientService, 
                        commonService, cohortService, patientMapper, observationsService, visitService) {

            var dateUtil = Bahmni.Common.Util.DateUtil;
            $scope.hasSchedules = false;
    
            function init() {
                var cohortMarked = 'aaeabe1c-60ce-45e0-a771-9876ed0de7e1';
                cohortService.get(cohortMarked).success(function (data) {
                        $scope.cohortMembers = data.members;
                        $scope.hasSchedules = true;

                    });
            };

            $scope.getLastConsultationAndVisit = function () {
                _.forEach($scope.cohortMembers, function (member) {
                    observationsService.get(member.uuid, 'e1dae630-1d5f-11e0-b929-000c29ad1d07')
                        .success(function (data) {
                            //skip if doesn't have next consultation
                            var nonRetired = commonService.filterRetired(data.results);
                            member.scheduledInfo = _.maxBy(nonRetired, 'encounter.encounterDatetime');
                        });

                    visitService.search({patient: member.uuid, 
                        v: 'custom:(visitType,startDatetime,stopDatetime,uuid,encounters)'})
                    .success(function (data) {          
                        member.lastVisit = _.maxBy(data.results, 'startDatetime');
                    });
                });
            };

            init();

        }]);
