'use strict';

angular.module('pharmacy').controller('DispensationHistoryController', DispensationHistoryController);

DispensationHistoryController.$inject = ["$scope", "$rootScope", "$stateParams", "encounterService", "commonService"];

function DispensationHistoryController($scope, $rootScope, $stateParams, encounterService, commonService) {
    
    (function () {
        $scope.filaObsList = {
            nextPickup: "e1e2efd8-1d5f-11e0-b929-000c29ad1d07",
            quantity: "e1de2ca0-1d5f-11e0-b929-000c29ad1d07"
        };

        var patientUuid = $stateParams.patientUuid;
        var pharmacyEncounterTypeUuid = "18fd49b7-6c2b-4604-88db-b3eb5b3a6d5f";

        encounterService.getEncountersForEncounterType(patientUuid, pharmacyEncounterTypeUuid).success(function (data) {
            $scope.pickups = prepareObservations(commonService.filterReverse(data));
        });
            
    })();


    var prepareObservations = function (encounters) {

        var observations = [];

        _.forEach(encounters, function (encounter) {
                
            _.forEach(encounter.obs, function (observation) {
                
                var obs = {

                    encounterDatetime : encounter.encounterDatetime,
                    provider : encounter.provider.display,
                    members : observation.groupMembers
                }

                observations.push(obs);
            });
        });

        return observations;
    };

    $scope.valueOfField = function(conceptUuid, members) {

        var field = _.find(members, function (member) {
            return member.concept.uuid === conceptUuid;
        });
      
        return field;;
    };
}