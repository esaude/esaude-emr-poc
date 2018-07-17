(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientOtherStep', {
      bindings: {
        patient: '<',
        form: '<',
        showMessages: '<'
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

    vm.patientAttributes = [];

    vm.$onInit = $onInit;

    function $onInit() {
      vm.patientAttributes = patientService.getPersonAttributesForStep('other');
    }

  }

})();
