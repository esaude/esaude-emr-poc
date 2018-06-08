(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientGenderStep', {
      bindings: {
        patient: '<'
      },
      controller: PatientGenderStepController,
      controllerAs: 'vm',
      require: {
        patientWizard: '^^',
      },
      templateUrl: '../common/patient/components/wizard/steps/patientGenderStep.html',
    });

  /* @ngInject */
  function PatientGenderStepController() {

    var vm = this;

    var NAME = 'gender';

    vm.$onInit = $onInit;
    vm.getName = getName;
    vm.shouldShowMessages = shouldShowMessages;

    function $onInit() {
      vm.patientWizard.setCurrentStep(vm);
    }

    function getName() {
      return NAME;
    }

    function shouldShowMessages() {
      return vm.patientWizard.showMessages;
    }
  }

})();
