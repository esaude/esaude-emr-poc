'use strict';

angular.module('vitals')
        .controller('VitalsController', ['$rootScope', '$scope', '$stateParams', 'visitService', 'observationsService', 'notifier',
                    function ($rootScope, $scope, $stateParams, visitService, observationsService, notifier) {
            var patientUuid;

            init();

            function init() {
                patientUuid = $stateParams.patientUuid;

                visitService.search({patient: patientUuid,
                    v: 'custom:(visitType,startDatetime,stopDatetime,uuid,encounters)'})
                .then(function (visits) {
                    $scope.lastVisit = _.maxBy(visits, 'startDatetime');
                });

                observationsService.getLastPatientVitalsObs(patientUuid, Bahmni.Common.Constants.BMI)
                  .then(function (data) {
                        $scope.lastBmi = data;
                  }).catch(function (data) {
                    notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
                });

                observationsService.getLastPatientVitalsObs(patientUuid, Bahmni.Common.Constants.HEIGHT_CM)
                  .then(function (data) {
                        $scope.lastHeight = data;
                    }).catch(function (error) {
                        notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
                    });
            }
        }]);
