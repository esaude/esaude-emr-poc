(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientOther', {
      bindings: {
        patient: '<'
      },
      controller: PatientAddressController,
      controllerAs: 'vm',
      templateUrl: '../common/patient/components/details//patientOther.html',
    });

  function PatientAddressController(patientService) {

    var vm = this;

    vm.$onInit = $onInit;

    function $onInit() {
      vm.personAttributes = patientService.getPersonAttributesForStep('other');
    }

  }

})();
