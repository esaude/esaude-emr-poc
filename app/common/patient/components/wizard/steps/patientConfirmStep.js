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
      require: {
        patientWizard: '^^',
      },
      templateUrl: '../common/patient/components/wizard/steps/patientConfirmStep.html',
    });

  /* @ngInject */
  function PatientConfirmStepController(patientService, configurationService) {

    var vm = this;

    var NAME = 'confirm';

    vm.patientAttributes = [];

    vm.$onInit = $onInit;
    vm.filterPersonAttributesForCurrStep = getPersonAttributesForStep;
    vm.getName = getName;

    function $onInit() {
      vm.patientWizard.setCurrentStep(vm);

      configurationService.getAddressLevels()
        .then(addressLevels => {
          vm.addressLevels = addressLevels;
        });

      vm.patientAttributes = patientService.getPersonAttributesForStep('testing');
    }

    function getPersonAttributesForStep(step) {
      return patientService.getPersonAttributesForStep(step);
    }

    function getName() {
      return NAME;
    }
  }

})();
