'use strict';

angular.module('clinic')
        .controller('SearchController', ['$scope', '$location', 'patientService', 'openmrsPatientMapper',
    function ($scope, $location, patientService, patientMapper) {
            $scope.results = [];
            
            var searchBasedOnQueryParameters = function () {
                if (hasSearchParameters()) {
                    var searchPromise = patientService.search(
                        $scope.searchText);
                    searchPromise['finally'](function () {
                    });
                    return searchPromise;
                }
            };
            
            var hasSearchParameters = function () {
                return $scope.searchText.trim().length > 0;
            };
            
            var showSearchResults = function (searchPromise) {
                if (searchPromise) {
                    searchPromise.success(function (data) {
                        $scope.results = mapPatient(data.results);
                        $scope.displayed = $scope.results;
                        $scope.noResultsMessage = $scope.results.length === 0 ? "No results found" : null;
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
                $location.url("/dashboard/" + patient.uuid); // path not hash
            };
            
            $scope.linkPatientNew = function() {
                $location.url("/patient/new/name"); // path not hash
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
        }]);