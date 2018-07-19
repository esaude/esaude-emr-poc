(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientHivTestStep', {
      bindings: {
        patient: '<',
        form: '<',
        showMessages: '<'
      },
      controller: PatientHIVTestStepController,
      controllerAs: 'vm',
      templateUrl: '../common/patient/components/wizard/steps/patientHIVTestStep.html'
    });

  /* @ngInject */
  function PatientHIVTestStepController(patientService) {

    var vm = this;

    vm.patientAttributes = [];

    vm.$onInit = $onInit;

    function $onInit() {
      vm.patientAttributes = patientService.getPersonAttributesForStep('testing');
      vm.datepickerOptions = { minDate: moment(vm.patient.birthdate).toDate(), maxDate: moment().toDate() };
    }

  }

})();
