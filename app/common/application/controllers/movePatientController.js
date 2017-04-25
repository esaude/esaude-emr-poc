'use strict';

angular.module('application')
        .controller('MovePatientController', ['$rootScope', '$scope', '$location', 'patientService', 'openmrsPatientMapper',
            'spinner', 'commonService', 'visitService', 'localStorageService',
    function ($rootScope, $scope, $location, patientService, patientMapper, spinner, 
        commonService, visitService, localStorageService) {
            $scope.results = [];

            var dateUtil = Bahmni.Common.Util.DateUtil;

            (function(){
                var movingPatient = localStorageService.get('movingPatient');

                localStorageService.remove('movingPatient');
                spinner.forPromise(patientService.get(movingPatient).success(function (data) {
                    var patient = patientMapper.map(data);
                    $rootScope.patient = patient;
                    redirectToPage(patient);
                }));
            }());

            var redirectToPage = function (patient) {
                 //initialize visit info in scope
                visitService.search({patient: patient.uuid, v: "full"})
                    .success(function (data) {
                        var nonRetired = commonService.filterRetired(data.results);
                        //in case the patient has an active visit
                        if (!_.isEmpty(nonRetired)) {
                            var lastVisit = _.maxBy(nonRetired, 'startDatetime');
                            var now = dateUtil.now();
                            //is last visit todays
                            if (dateUtil.parseDatetime(lastVisit.startDatetime) <= now && 
                                dateUtil.parseDatetime(lastVisit.stopDatetime) >= now) {
                                $rootScope.hasVisitToday = true;
                                $rootScope.todayVisit = lastVisit;
                            } else {
                                $rootScope.hasVisitToday = false;
                            }
                        }

                    $location.url(eval($rootScope.landingPageAfterSearch)); // path not hash
                });
            }
        }]);
