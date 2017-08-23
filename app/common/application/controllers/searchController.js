'use strict';

angular.module('application')
        .controller('SearchController', ['$rootScope', '$scope', '$location', 'patientService', 'openmrsPatientMapper',
            'spinner', 'observationsService', 'commonService', 'visitService',
    function ($rootScope, $scope, $location, patientService, patientMapper, spinner, observationsService,
        commonService, visitService) {
            $scope.results = [];

            var dateUtil = Bahmni.Common.Util.DateUtil;

            var searchBasedOnQueryParameters = function () {
                if (hasSearchParameters()) {
                    var searchPromise = patientService.search(
                        $scope.searchText);
                    searchPromise['finally'](function () {
                    });
                    return spinner.forPromise(searchPromise);
                }
            };

            var hasSearchParameters = function () {
                return $scope.searchText.trim().length > 0;
            };

            var showSearchResults = function (searchPromise) {
                if (searchPromise) {
                    searchPromise.success(function (data) {
                        $scope.results = mapPatient(data.results);
                        findLastDateOfNextConsultation();
                        $scope.displayed = $scope.results;
                        $scope.noResultsMessage = $scope.results.length === 0 ? "SEARCH_PATIENT_NO_RESULT" : null;
                    });
                }
            };

            $scope.change = function (text) {
                //start loading data at 3 chars
              $scope.searchText = text;
              showSearchResults(searchBasedOnQueryParameters(text));
            };

            $scope.barcodeHandler = function (code) {
                //replace any special char by "/"
                var cleanCode = code.replace(/[^\w\s]/gi, '/');
                var nidRegex = new RegExp("[0-9]{8}/[0-9]{2}/[0-9]{5}");
                if (!nidRegex.test(cleanCode)) {
                    return;
                }

                spinner.forPromise(patientService.search(cleanCode).success(function (data) {
                    if (data.results.length !== 1) {
                        return;
                    }
                    var patient = patientMapper.map(data.results[0]);
                    $rootScope.patient = patient;
                    redirectToPage(patient);
                }).error(function (data) {
                    $scope.noResultsMessage = "SEARCH_PATIENT_NO_RESULT";
                }));

            };

            $scope.linkDashboard = function(patient) {
                if (patient.age) {
                    $rootScope.patient = patient;
                    redirectToPage(patient);
                } else {
                    patientService.getPatient(patient.uuid).then(function (patient) {
                        $rootScope.patient = patient;
                        redirectToPage(patient);
                    });
                }
            };

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
            };

            $scope.linkPatientNew = function() {
                $location.url("/patient/new/identifier"); // path not hash
            };

            function mapPatient(results) {
                //prepare results to be presented in search table
                var preparedResults = [];
                for(var patientIndex in results) {
                    var result = results[patientIndex];
                    var patient = patientMapper.map(result);

                    preparedResults.push(patient);
                }
                preparedResults =   _.sortBy(preparedResults, ['givenName','familyName']);
                return preparedResults;
            }

            var findLastDateOfNextConsultation = function () {
                _.forEach($scope.results, function (result) {
                    observationsService.get(result.uuid, 'e1dae630-1d5f-11e0-b929-000c29ad1d07')
                    .success(function (data) {
                        //skip if doesn't have next consultation
                        if(_.isEmpty(data.results)) return;

                        var nonRetired = commonService.filterRetired(data.results);
                        var maxResult = _.maxBy(nonRetired, 'encounter.encounterDatetime');
                        //check if past, current or future schedule
                        var now = dateUtil.now();
                        var dateDiff = dateUtil.diffInDaysRegardlessOfTime(now, maxResult.value);
                        result.nextConsultation = maxResult.value;
                        if (dateDiff < 0) {
                            result.scheduledTo = "P";
                        }
                        else if (dateDiff > 0) {
                            result.scheduledTo = "F";
                        } else {
                            result.scheduledTo = "A";
                        }
                    });
                });
            };
        }]);
