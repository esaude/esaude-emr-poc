'use strict';

angular.module('registration')
        .controller('SearchController', function ($scope, $location, patientServiceMock) {

            init();

            function init() {
                $scope.patients = patientServiceMock.getPatients();
            }
            
            $scope.linkDashboard = function(patient) {
                $location.url("/dashboard/" + patient.uuid); // path not hash
            };
            
            $scope.linkPatientNew = function() {
                $location.url("/patient/new/name"); // path not hash
            };

        });