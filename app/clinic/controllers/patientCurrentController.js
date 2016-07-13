'use strict';
(function () {
  angular.module('clinic')
    .controller('PatientCurrentController', ["$scope", "$rootScope", "$stateParams", "encounterService", "observationsService",
      function ($scope, $rootScope, $stateParams, encounterService, obsService) {

        var patientUuid= $stateParams.patientUuid;


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
            ($scope.patient.age.years >= 15) ? Bahmni.Clinic.Constants.ADULT_FOLLOWUP_ENCOUTER_UUID : Bahmni.Clinic.Constants.CHILD_FOLLOWUP_ENCOUNTER_UUID)
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
          encounterService.getEncountersForEncounterType(patientUuid, Bahmni.Clinic.Constants.LAB_ENCOUNTER_TYPE_UUID).success(function (data) {
            filterGroupReverse(data, "labs");
          });
        };

        $scope.initVitals = function () {
          var conceptsUuids =
          [Bahmni.Clinic.Constants.SYSTOLIC_BLOOD_PRESSURE, Bahmni.Clinic.Constants.DIASTOLIC_BLOOD_PRESSURE ,
            Bahmni.Clinic.Constants.WEIGHT_KG, Bahmni.Clinic.Constants.HEIGHT_CM, Bahmni.Clinic.Constants.TEMPERATURE];
          filterGroupReverseObs(conceptsUuids, "vitals");
        };

      }]);
})();
