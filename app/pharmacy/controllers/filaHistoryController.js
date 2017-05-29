'use strict';

angular.module('pharmacy')
        .controller('FilaHistoryController', FilaHistoryController);

FilaHistoryController.$inject = ["$scope", "$rootScope", "$stateParams",
                        "encounterService", "observationsService", "commonService"];

function FilaHistoryController($scope, $rootScope, $stateParams, encounterService,
                    observationsService, commonService) {
    //TODO: Check if vm is needed
    var vm = this;
    var dateUtil = Bahmni.Common.Util.DateUtil;

    (function () {
        $scope.filaObsList = {
            posology: "e1de28ae-1d5f-11e0-b929-000c29ad1d07",
            nextPickup: "e1e2efd8-1d5f-11e0-b929-000c29ad1d07",
            regimen: "e1d83e4e-1d5f-11e0-b929-000c29ad1d07",
            quantity: "e1de2ca0-1d5f-11e0-b929-000c29ad1d07"
        };

        var patientUuid = $stateParams.patientUuid;

        encounterService.getPatientPharmacyEncounters(patientUuid).then(function (encounters) {
            $scope.pickups = encounters;
            $scope.displayed = $scope.pickups;
        });

    })();

    $scope.isObject = function (value) {
        return _.isObject(value);
    };

    $scope.valueOfField = function(conceptUuid, obs) {

        var field = _.find(obs, function (o) {
            return o.concept.uuid === conceptUuid;
        });

        if (field === undefined) return indefined;

        if (_.isObject(field.value)) {
            return field.value.display;
        } else {
            return field.value;
        }
    }
}
