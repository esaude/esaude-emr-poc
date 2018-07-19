(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientConfirmStep', {
      bindings: {
        patient: '<'
      },
      controller: PatientConfirmStepController,
      controllerAs: 'vm',
      templateUrl: '../common/patient/components/wizard/steps/patientConfirmStep.html'
    });

  /* @ngInject */
  function PatientConfirmStepController(patientService, configurationService) {

    var vm = this;

    vm.patientAttributes = [];

    vm.$onInit = $onInit;
    vm.filterPersonAttributesForCurrStep = getPersonAttributesForStep;

    function $onInit() {
      configurationService.getAddressLevels()
        .then(addressLevels => {
          vm.addressLevels = addressLevels;
        });

      vm.patientAttributes = patientService.getPersonAttributesForStep('testing');
    }

    function getPersonAttributesForStep(step) {
      return patientService.getPersonAttributesForStep(step);
    }

  }

})();
