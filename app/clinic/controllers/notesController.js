'use strict';

angular.module('clinic')
        .controller('NotesController', ["$scope", "$filter", "$stateParams", 
                        "encounterService", "observationsService",
                    function ($scope, $filter, $stateParams, encounterService, 
                    observationsService) {
                  
        var dateUtil = Bahmni.Common.Util.DateUtil;
        var patientUuid;
        $scope.notes = {};
        $scope.notes.obs = [];
        $scope.note = {};
        $scope.newNote = {};
        
        $scope.addNote = function () {
            $scope.newNote.creator = "Super User";
            $scope.newNote.datetime = dateUtil.now;
            $scope.notes.obs.push($scope.newNote);
            $scope.note = $scope.newNote;
            //clean
            $scope.newNote = {};
            $scope.notes.show = false;
        };
        

        var init = function () {
            patientUuid = $stateParams.patientUuid;
            $scope.notes.show = false;
            $scope.notes.priorities = [
                {
                    id: "info",
                    label: $filter('translate')('CLINICAL_OBSERVATIONS_INFO')
                },
                {
                    id: "warning",
                    label: $filter('translate')('CLINICAL_OBSERVATIONS_WARNING')
                },
                {
                    id: "wrrong",
                    label: $filter('translate')('CLINICAL_OBSERVATIONS_WRRONG')
                },
                {
                    id: "success",
                    label: $filter('translate')('CLINICAL_OBSERVATIONS_SUCCESS')
                }
            ];
            
            $scope.note.observation = "O paciente está a apresentar um quadro de falência terapêutica.\n \r Observar na proxima consulta";
            $scope.note.priority = $scope.notes.priorities[1];
            $scope.note.creator = "Super User";
        };
        
        init();
    }]);
