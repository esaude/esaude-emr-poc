'use strict';

angular.module('clinic')
        .controller('NotesController', ["$scope", "$filter", "$stateParams", 
                        "encounterService", "observationsService",
                    function ($scope, $filter, $stateParams, encounterService, 
                    observationsService) {
        
        var patientUuid;
        $scope.showNotes = true;
        

        (function () {
            patientUuid = $stateParams.patientUuid;
            
            encounterService.getEncountersForEncounterType(patientUuid, Bahmni.Common.Constants.pocCurrentStoryEncounterUuid)
                    .success(function (data) {
                        var nonRetired = encounterService.filterRetiredEncoounters(data.results);
                        
                        if (_.isEmpty(nonRetired)) {
                            $scope.showNotes = false;
                            return;
                        }
                        $scope.allNotes = nonRetired;
                        $scope.lastNotes = _.maxBy(nonRetired, 'encounterDatetime');
                        $scope.lastNotesMessageType = _.find($scope.lastNotes.obs, function (o) {
                            return o.concept.uuid === Bahmni.Common.Constants.typeOfMessageConceptUuid;
                        });
                        $scope.lastNotesStory = _.find($scope.lastNotes.obs, function (o) {
                            return o.concept.uuid === Bahmni.Common.Constants.observationStoryConceptuuid;
                        });
                        $scope.messageTypeMapping = Bahmni.Common.Constants
                                .messageTypeRepresentation[$scope.lastNotesMessageType.value.uuid];
            });
        })();
    }]);
