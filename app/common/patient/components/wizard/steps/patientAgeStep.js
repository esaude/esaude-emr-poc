(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientAgeStep', {
      bindings: {
        patient: '<'
      },
      controller: PatientAgeStepController,
      controllerAs: 'vm',
      require: {
        patientWizard: '^^',
      },
      templateUrl: '../common/patient/components/wizard/steps/patientAgeStep.html',
    });

  /* @ngInject */
  function PatientAgeStepController() {

    var now = new Date();

    var vm = this;

    var NAME = 'age';

    vm.birthDatepickerOptions = {maxDate: now};

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
