'use strict';

angular.module('registration')
        .controller('ScheduleListController', ['$rootScope', '$scope', 'patientService', 
            'commonService', 'cohortService', 'openmrsPatientMapper', 'observationsService', 'visitService',
                    function ($rootScope, $scope, patientService, 
                        commonService, cohortService, patientMapper, observationsService, visitService) {

            var dateUtil = Bahmni.Common.Util.DateUtil;
            $scope.hasSchedules = false;
    
            function init() {
                cohortService.get(Bahmni.Common.Constants.cohortMarkedForConsultationUuid).success(function (data) {
                        $scope.cohortMembers = data.members;
                        $scope.hasSchedules = true;

                    });
            };

            $scope.getLastConsultationAndVisit = function () {
                _.forEach($scope.cohortMembers, function (member) {
                    observationsService.get(member.uuid, Bahmni.Common.Constants.nextConsultationDateUuid)
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
