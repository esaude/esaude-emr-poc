'use strict';

angular.module('registration')
        .controller('DashboardController', function ($scope, $rootScope, $location, $state, $stateParams, programServiceMock, patientServiceMock) {
            var patientUuid;
    
            init();
    
            function init() {
                patientUuid = $stateParams.patientUuid;
                
                $rootScope.patient = patientServiceMock.getPatientByUuid(patientUuid);
                
                $scope.programs = programServiceMock.getPrograms();
                $scope.patientPrograms = programServiceMock.getPatientPrograms(1);
                $scope.programStates = programServiceMock.getProgramStates();
                $scope.newProgram = {};
            }

            $scope.saveProgram = function () {
                var program = $scope.newProgram.program;
                var admissionDate = $("#program_admission_datetime_picker").data('date');
                var location = $scope.newProgram.location;
                var state = $scope.newProgram.state;
                programServiceMock.addPatientProgram(1, program, admissionDate, location, state);
                $scope.patientPrograms.push(programServiceMock.getPatientPrograms(1)[programServiceMock.getPatientPrograms(1).length - 1]);
                
                //close modal dialog
                $('#addProgramModal').modal('hide');
            };
            
            $scope.linkSearch = function() {
                $location.url("/search"); // path not hash
            };
            
            $scope.linkVisit = function() {
                //$state.go("dashboard.visit");
                $location.url("/visit/" + patientUuid); // path not hash
            };
            $scope.linkPatientDetail = function() {
                $location.url("/patient/detail/" + patientUuid + "/demographic"); // path not hash
            };
        });
