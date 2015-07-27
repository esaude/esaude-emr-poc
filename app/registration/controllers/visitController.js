'use strict';

angular.module('registration')
        .controller('VisitController', function ($rootScope, $scope, $stateParams, $location, visitServiceMock, patientServiceMock) {
            var patientUuid;
    
            init();
    
            function init() {
                patientUuid = $stateParams.patientUuid;
                
                $rootScope.patient = patientServiceMock.getPatientByUuid(patientUuid);
                $scope.visitTypes = visitServiceMock.getVisitTypes();
                $scope.patientVisits = visitServiceMock.getPatientVisits();
                $scope.newVisit = {};
            }
            
            $scope.saveVisit = function () {
                var visitType = $scope.newVisit.visitType;
                var dateStarted = $("#visit_started_datetime_picker").data('date');
                var dateStopped = $("#visit_stopped_datetime_picker").data('date');
                var location = $scope.newVisit.location;
                
                visitServiceMock.addPatientVisit(1, visitType, dateStarted, dateStopped, location);
                
                //close modal dialog
                $('#addVisitModal').modal('hide');
            };
            
            $scope.linkDashboard = function(patient) {
                $location.url("/dashboard/" + $scope.patient.uuid); // path not hash
            };
        });
