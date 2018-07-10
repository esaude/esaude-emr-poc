(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientHIVTestStep', {
      bindings: {
        patient: '<'
      },
      controller: PatientHIVTestStepController,
      controllerAs: 'vm',
      require: {
        patientWizard: '^^',
      },
      templateUrl: '../common/patient/components/wizard/steps/patientHIVTestStep.html',
    });

  /* @ngInject */
  function PatientHIVTestStepController(patientService) {

    var vm = this;

    var NAME = 'testing';

    vm.patientAttributes = [];

    vm.$onInit = $onInit;
    vm.getName = getName;
    vm.shouldShowMessages = shouldShowMessages;

    function $onInit() {
      vm.patientWizard.setCurrentStep(vm);
      vm.patientAttributes = patientService.getPersonAttributesForStep('testing');
      vm.datepickerOptions = {minDate: moment(vm.patient.birthdate).toDate(), maxDate: moment().toDate()};
    }

    function getName() {
      return NAME;
    }

    function shouldShowMessages() {
      return vm.patientWizard.showMessages;
    }
  }

})();
