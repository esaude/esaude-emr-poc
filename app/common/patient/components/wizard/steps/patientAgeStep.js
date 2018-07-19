(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientAgeStep', {
      bindings: {
        patient: '<',
        form: '<',
        showMessages: '<'
      },
      controller: PatientAgeStepController,
      controllerAs: 'vm',
      templateUrl: '../common/patient/components/wizard/steps/patientAgeStep.html'
    });

  /* @ngInject */
  function PatientAgeStepController() {

    var now = new Date();

    var vm = this;

    vm.birthDatepickerOptions = { maxDate: now };

    vm.$onInit = $onInit;

    function $onInit() {
    }

  }

})();
