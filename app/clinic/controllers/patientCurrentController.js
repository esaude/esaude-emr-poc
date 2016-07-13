'use strict';
(function () {
  angular.module('clinic')
    .controller('PatientCurrentController', ["$scope", "$rootScope", "$stateParams", "encounterService", "observationsService",
      function ($scope, $rootScope, $stateParams, encounterService, obsService) {

        var patientUuid= $stateParams.patientUuid;
        var adultFollowupEncounterUuid = "e278f956-1d5f-11e0-b929-000c29ad1d07";
        var childFollowupEncounterUuid = "e278fce4-1d5f-11e0-b929-000c29ad1d07";
        var labEncounterTypeUuid = "e2790f68-1d5f-11e0-b929-000c29ad1d07";


        var filterGroupReverse = function (data, element) {
          var nonRetired = encounterService.filterRetiredEncoounters(data.results);
          var grouped = _.groupBy(nonRetired, function (element) {
            return Bahmni.Common.Util.DateUtil.getDate(element.encounterDatetime);
          });
          var reversed = _.values(grouped).reverse();
          $scope[element] = reversed;
        };

        var filterGroupReverseObs = function (concepts, element) {
          encounterService.getEncountersForEncounterType(patientUuid,
            ($scope.patient.age.years >= 15) ? adultFollowupEncounterUuid : childFollowupEncounterUuid)
            .success(function (data) {
              var nonRetired = encounterService.filterRetiredEncoounters(data.results);
              _.forEach(nonRetired, function (encounter) {
                encounter.obs = obsService.filterByList(encounter.obs, concepts);
              });
              var filtered = _.filter(nonRetired, function (encounter) {
                return !_.isEmpty(encounter.obs);
              });
              $scope[element] = filtered.reverse();
            });
        };

        $scope.initLabResults = function () {
          encounterService.getEncountersForEncounterType(patientUuid, labEncounterTypeUuid).success(function (data) {
            filterGroupReverse(data, "lab");
          });
        };

        $scope.initVitals = function () {
          var conceptsUuids =
          ["e1e2e934-1d5f-11e0-b929-000c29ad1d07", "e1e2e4e8-1d5f-11e0-b929-000c29ad1d07",
          "e1e2e826-1d5f-11e0-b929-000c29ad1d07", "e1da52ba-1d5f-11e0-b929-000c29ad1d07",
          "e1e2e70e-1d5f-11e0-b929-000c29ad1d07", "e1e2e3d0-1d5f-11e0-b929-000c29ad1d07"
          ];
          filterGroupReverseObs(conceptsUuids, "vitals");
        };

      }]);
})();
