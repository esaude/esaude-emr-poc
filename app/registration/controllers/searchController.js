'use strict';

angular.module('registration')
        .controller('SearchController', ['$scope', '$location', 'patientService', 
    function ($scope, $location, patientService) {
            $scope.results = [];
            
            var searchBasedOnQueryParameters = function () {
                if (hasSearchParameters()) {
                    var searchPromise = patientService.search(
                        $scope.searchText);
                    searchPromise['finally'](function () {
                        //search by identifier if no name found
                        searchPromise.success(function (data) {
                            if(data.results.length === 0) {
                                searchPromise = patientService.getByIdentifier($scope.searchText);
                            }
                        });
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
                        $scope.results = patientSearchUtil(data.results);
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
            
            function patientSearchUtil(results) {
                //prepare results to be presented in search table
                var preparedResults = [];
                for(var patientIndex in results) {
                    var result = results[patientIndex];
                    var patient = {identifier: "", givenName: "", middleName: "", familyName: "", age: "", birthdate:"", uuid: ""};
                    //find the correct identifier NID - TARV
                    for(var identifierIndex in result.identifiers) {
                        var identifier = result.identifiers[identifierIndex];
                        //check identifier type
                        if(identifier.identifierType.display === "NID (SERVICO TARV)") {
                            patient.identifier = identifier.identifier;
                        }
                    }
                    if(typeof result.person !== "undefined" && typeof result.person.names !== "undefined") {
                        var name = result.person.names[0];
                        patient.givenName = name.givenName;
                        patient.middleName = name.middleName;
                        patient.familyName = name.familyName;
                    }
                    //prepare age and birthdate
                    if(typeof result.person !== "undefined") {
                        patient.gender = result.person.gender;
                        patient.age = result.person.age;
                        patient.birthdate = result.person.birthdate;
                    }
                    patient.uuid = result.uuid;
                    
                    preparedResults.push(patient);
                }
                return preparedResults;
            }

                $scope.callServer = function (tableState) {
                    debugger;

                    var pagination = tableState.pagination;

                    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    var number = pagination.number || 10;  // Number of entries showed per page.

                    tableState.pagination.numberOfPages = 10;//$scope.results.length / number;//set the number of pages so the pagination can update
                    console.log(tableState.pagination.numberOfPages);
                    console.log(tableState.pagination.number);
                };
        }]);