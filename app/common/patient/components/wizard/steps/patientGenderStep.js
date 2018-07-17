(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientGenderStep', {
      bindings: {
        patient: '<',
        form: '<',
        showMessages: '<'
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

    vm.$onInit = $onInit;

    function $onInit() {
    }

  }

})();
