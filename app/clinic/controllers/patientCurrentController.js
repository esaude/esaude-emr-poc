'use strict';
(function () {
  angular.module('clinic')
    .controller('PatientCurrentController', ["$scope", "$rootScope", "$stateParams", "encounterService", "observationsService",
      function ($scope, $rootScope, $stateParams, encounterService, obsService) {

        var patientUuid= $stateParams.patientUuid;
        $scope.initLabResults = initLabResults();
        $scope.initVitals = initVitals();


        function filterGroupReverseEncounters(data, element) {
          var nonRetired = encounterService.filterRetiredEncoounters(data.results);
          var grouped = _.groupBy(nonRetired, function (element) {
            return Bahmni.Common.Util.DateUtil.getDate(element.encounterDatetime);
          });
          $scope[element] = _.values(grouped).reverse();
        };

        function filterGroupReverseObs(concepts, element) {
          encounterService.getEncountersForEncounterType(patientUuid,
            ($scope.patient.age.years >= 15) ? Bahmni.Common.Constants.ADULT_FOLLOWUP_ENCOUTER_UUID : Bahmni.Common.Constants.CHILD_FOLLOWUP_ENCOUNTER_UUID)
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

        function initLabResults() {
          encounterService.getEncountersForEncounterType(patientUuid, Bahmni.Common.Constants.LAB_ENCOUNTER_TYPE_UUID).success(function (data) {
            filterGroupReverseEncounters(data, "labResults");
          });
        };

        function initVitals() {
          var conceptsUuids =
          [Bahmni.Common.Constants.SYSTOLIC_BLOOD_PRESSURE, Bahmni.Common.Constants.DIASTOLIC_BLOOD_PRESSURE ,
            Bahmni.Common.Constants.WEIGHT_KG, Bahmni.Common.Constants.HEIGHT_CM, Bahmni.Common.Constants.TEMPERATURE,
            Bahmni.Common.Constants.FREQUENCIA_CARDIACA,Bahmni.Common.Constants.RESPIRATORY_RATE];
          filterGroupReverseObs(conceptsUuids, "vitals");
        };

        $scope.isObject = function (value) {
          return _.isObject(value);
        };

      }]);
})();
