'use strict';

angular.module('application')
        .controller('SearchController', ['$rootScope', '$scope', '$location', 'patientService', 'openmrsPatientMapper', 'spinner',
    function ($rootScope, $scope, $location, patientService, patientMapper, spinner) {
            $scope.results = [];

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
                        $scope.results = patientMapper.mapPatient(data.results);
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
                $rootScope.patient = patient;
                $location.url("/dashboard/" + patient.uuid); // path not hash
            };

            $scope.linkPatientNew = function() {
                $location.url("/patient/new/name"); // path not hash
            };
        }]);
