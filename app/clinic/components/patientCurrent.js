(function () {
  'use strict';

  angular
    .module('clinic')
    .component('patientCurrent', {
      bindings: {
        patient: '<'
      },
      controller: PatientCurrentController,
      controllerAs: 'vm',
      templateUrl: '../clinic/components/patientCurrent.html'
    });

  /* @ngInject */
  function PatientCurrentController($scope, encounterService, observationsService) {

    var vm = this;

    vm.$onInit = $onInit;

    vm.isObject = _.isObject;

    function $onInit() {
      initVitals();
      initLabResults();
    }

    function initLabResults() {
      return encounterService.getEncountersForEncounterType(vm.patient.uuid, Bahmni.Common.Constants.LAB_ENCOUNTER_TYPE_UUID, "default")
        .then(encounters => {
          var nonRetired = encounterService.filterRetiredEncoounters(encounters);
          var grouped = _.groupBy(nonRetired, element => Bahmni.Common.Util.DateUtil.getDate(element.encounterDatetime));
          vm.labResults = _.values(grouped).reverse();
        });
    }

    function initVitals() {
      var conceptsUuids =
        [Bahmni.Common.Constants.SYSTOLIC_BLOOD_PRESSURE, Bahmni.Common.Constants.DIASTOLIC_BLOOD_PRESSURE,
          Bahmni.Common.Constants.WEIGHT_KG, Bahmni.Common.Constants.HEIGHT_CM, Bahmni.Common.Constants.TEMPERATURE,
          Bahmni.Common.Constants.FREQUENCIA_CARDIACA, Bahmni.Common.Constants.RESPIRATORY_RATE];

      return encounterService.getEncountersForEncounterType(vm.patient.uuid,
        (vm.patient.age.years >= 15) ? Bahmni.Common.Constants.ADULT_FOLLOWUP_ENCOUTER_UUID : Bahmni.Common.Constants.CHILD_FOLLOWUP_ENCOUNTER_UUID, "default")
        .then(encounters => {
          var nonRetired = encounterService.filterRetiredEncoounters(encounters);
          _.forEach(nonRetired, encounter => {
            encounter.obs = observationsService.filterByList(encounter.obs, conceptsUuids);
          });
          var filtered = _.filter(nonRetired, encounter => !_.isEmpty(encounter.obs));
          vm.vitals = filtered.reverse();
        });
    }
  }

})();
