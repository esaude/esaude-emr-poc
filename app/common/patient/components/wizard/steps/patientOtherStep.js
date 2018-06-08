(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientOtherStep', {
      bindings: {
        patient: '<'
      },
      controller: PatientOtherStepController,
      controllerAs: 'vm',
      require: {
        patientWizard: '^^',
      },
      templateUrl: '../common/patient/components/wizard/steps/patientOtherStep.html',
    });

  /* @ngInject */
  function PatientOtherStepController(patientService) {

    var vm = this;

    var NAME = 'other';

    vm.patientAttributes = [];

    vm.$onInit = $onInit;
    vm.getName = getName;
    vm.shouldShowMessages = shouldShowMessages;

    function $onInit() {
      vm.patientWizard.setCurrentStep(vm);
      vm.patientAttributes = patientService.getPersonAttributesForStep('other');
    }

    function getName() {
      return NAME;
    }

    function shouldShowMessages() {
      return vm.patientWizard.showMessages;
    }
  }

})();
