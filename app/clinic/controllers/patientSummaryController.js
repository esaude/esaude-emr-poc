'use strict';

angular.module('clinic')
        .controller('PatientSummaryController', ["$scope", "$location", "$stateParams", "encounterService", 
                    function ($scope, $location, $stateParams, encounterService) {
        var patientUuid;

        (function () {
            patientUuid = $stateParams.patientUuid;
            encounterService.getEncountersOfPatient(patientUuid).success(function (data) {
                var nonRetired = encounterService.filterRetiredEncoounters(data.results);
                var grouped = _.groupBy(nonRetired, function (element) {
                    return Bahmni.Common.Util.DateUtil.getDate(element.encounterDatetime);
                });
                var reversed = _.values(grouped).reverse();
                $scope.visits = reversed;
                console.log(reversed);
            });
        })();

    }]);
