'use strict';

angular.module('clinic')
        .controller('ScheduleListController', ['$rootScope', '$scope',
            'commonService', 'cohortService', 'observationsService', 'visitService',
                    function ($rootScope, $scope, commonService, cohortService, observationsService, visitService) {

            $scope.hasSchedules = false;

            function init() {
                cohortService.getWithParams(Bahmni.Common.Constants.cohortMarkedForConsultationAndCheckedInUuid, {providerUuid: $rootScope.currentProvider.uuid}).success(function (data) {
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
