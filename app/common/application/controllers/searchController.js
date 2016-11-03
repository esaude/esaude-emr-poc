'use strict';

angular.module('application')
        .controller('SearchController', ['$rootScope', '$scope', '$location', 'patientService', 'openmrsPatientMapper',
            'spinner', 'observationsService', 'commonService',
    function ($rootScope, $scope, $location, patientService, patientMapper, spinner, observationsService, commonService) {
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
                if(text.trim().length === 0) {
                    $scope.results = [];
                    $scope.displayed = [];
                }
                else if(text.trim().length > 2) {
                    $scope.searchText = text;
                    showSearchResults(searchBasedOnQueryParameters(text));
                }
            };

            $scope.linkDashboard = function(patient) {
                if (patient.age) {
                    $rootScope.patient = patient;
                } else {
                    patientService.get(patient.uuid).success(function (data) {
                        $rootScope.patient = patientMapper.map(data);
                    });
                }
                $location.url(eval($rootScope.landingPageAfterSearch)); // path not hash
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
