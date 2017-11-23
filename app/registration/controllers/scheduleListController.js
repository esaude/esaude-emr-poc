'use strict';

angular.module('registration')
        .controller('ScheduleListController', ['$rootScope', '$scope', 'patientService',
            'commonService', 'cohortService', 'openmrsPatientMapper', 'observationsService', 'visitService',
                    function ($rootScope, $scope, patientService,
                        commonService, cohortService, patientMapper, observationsService, visitService) {

            $scope.hasSchedules = false;

            //TODO: Remove duplication on of controller on clinic module
            function init() {
                cohortService.get(Bahmni.Common.Constants.cohortMarkedForConsultationUuid).success(function (data) {
                        $scope.cohortMembers = data.members;
                        $scope.hasSchedules = true;

                    });
            }

            $scope.getLastConsultationAndVisit = function () {
                _.forEach($scope.cohortMembers, function (member) {
                    observationsService.getObs(member.uuid, Bahmni.Common.Constants.nextConsultationDateUuid)
                        .success(function (data) {
                            //skip if doesn't have next consultation
                            var nonRetired = commonService.filterRetired(data.results);
                            member.scheduledInfo = _.maxBy(nonRetired, 'encounter.encounterDatetime');
                        });

                    visitService.search({patient: member.uuid,
                        v: 'custom:(visitType,startDatetime,stopDatetime,uuid,encounters)'})
                    .then(function (visits) {
                        member.lastVisit = _.maxBy(visits, 'startDatetime');
                    });
                });
            };

            init();

        }]);
