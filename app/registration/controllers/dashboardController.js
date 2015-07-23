'use strict';

angular.module('registration')
        .controller('DashboardController', function ($scope, $location, $stateParams, programServiceMock, patientServiceMock) {
            var patientUuid;
            var patient;
    
            init();
    
            function init() {
                patientUuid = $stateParams.patientUuid;
                patient = patientServiceMock.getPatientByUuid(patientUuid);
                
                $scope.patientName = patient.givenName + " " + patient.familyName;
                $scope.patientIdentifier = patient.nid;
                
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
        });
