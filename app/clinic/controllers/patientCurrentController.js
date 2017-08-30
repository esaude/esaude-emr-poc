(function () {
  'use strict';

  angular
    .module('clinic')
    .controller('PatientCurrentController', PatientCurrentController);

  PatientCurrentController.$inject = ['$scope',  $stateParams', 'encounterService', 'observationsService', 'patientService'];

  /* @ngInject */
  function PatientCurrentController($scope, $stateParams, encounterService, observationsService, patientService) {

    var patientUUID = $stateParams.patientUuid;
    var patient = {};

    $scope.initLabResults = initLabResults;
    $scope.initVitals = initVitals;
    $scope.isObject = _.isObject;

    activate();

    ////////////////

    function activate() {
      getPatient()
        .then(function (p) { patient = p; })
        .then(initVitals)
        .then(initLabResults);
    }

    function initLabResults() {
      return encounterService.getEncountersForEncounterType(patientUUID, Bahmni.Common.Constants.LAB_ENCOUNTER_TYPE_UUID).success(function (data) {
        return filterGroupReverseEncounters(data, "labResults");
      });
    }

    function initVitals() {
      var conceptsUuids =
      [Bahmni.Common.Constants.SYSTOLIC_BLOOD_PRESSURE, Bahmni.Common.Constants.DIASTOLIC_BLOOD_PRESSURE ,
        Bahmni.Common.Constants.WEIGHT_KG, Bahmni.Common.Constants.HEIGHT_CM, Bahmni.Common.Constants.TEMPERATURE,
        Bahmni.Common.Constants.FREQUENCIA_CARDIACA,Bahmni.Common.Constants.RESPIRATORY_RATE];
      return filterGroupReverseObs(conceptsUuids, "vitals");
    }

    function filterGroupReverseEncounters(data, element) {
      var nonRetired = encounterService.filterRetiredEncoounters(data.results);
      var grouped = _.groupBy(nonRetired, function (element) {
        return Bahmni.Common.Util.DateUtil.getDate(element.encounterDatetime);
      });
      $scope[element] = _.values(grouped).reverse();
    }

    function filterGroupReverseObs(concepts, element) {
      return encounterService.getEncountersForEncounterType(patientUUID,
        (patient.age.years >= 15) ? Bahmni.Common.Constants.ADULT_FOLLOWUP_ENCOUTER_UUID : Bahmni.Common.Constants.CHILD_FOLLOWUP_ENCOUNTER_UUID)
        .success(function (data) {
          var nonRetired = encounterService.filterRetiredEncoounters(data.results);
          _.forEach(nonRetired, function (encounter) {
            encounter.obs = observationsService.filterByList(encounter.obs, concepts);
          });
          var filtered = _.filter(nonRetired, function (encounter) {
            return !_.isEmpty(encounter.obs);
          });
          $scope[element] = filtered.reverse();
        });
    }

    function getPatient() {
      return patientService.getPatient(patientUUID);
    }
}

})();
