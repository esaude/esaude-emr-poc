'use strict';

angular.module('pharmacy').controller('DispensationHistoryController', DispensationHistoryController);

DispensationHistoryController.$inject = ["$scope", "$rootScope", "$stateParams", "encounterService", "observationsService", "commonService"];

function DispensationHistoryController($scope, $rootScope, $stateParams, encounterService, observationsService, commonService) {

    var dateUtil = Bahmni.Common.Util.DateUtil;
    
    (function () {
        $scope.filaObsList = {
            nextPickup: "e1e2efd8-1d5f-11e0-b929-000c29ad1d07",
            quantity: "e1de2ca0-1d5f-11e0-b929-000c29ad1d07"
        };

        var patientUuid = $stateParams.patientUuid;
        var pharmacyEncounterTypeUuid = "d82c441d-72cb-440f-b007-d3105ca7f58a";

        encounterService.getEncountersForEncounterType(patientUuid, pharmacyEncounterTypeUuid).success(function (data) {
            $scope.pickups = commonService.filterReverse(data);
            console.log($scope.pickups);
        });
            
    })();

    $scope.valueOfField = function(conceptUuid, observations) {

        var fieldResult;

        _.forEach(observations, function (observations) {
           
            var field = _.find(observations.groupMembers, function (member) {
                return member.concept.uuid === conceptUuid;
            });

            fieldResult = field;
        });

        return fieldResult;
    }
}