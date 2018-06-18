(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientHivTest', {
      bindings: {
        patient: '<'
      },
      controller: PatientAddressController,
      controllerAs: 'vm',
      templateUrl: '../common/patient/components/details//patientHivTest.html',
    });

  function PatientAddressController(patientService) {

    var vm = this;

    vm.$onInit = $onInit;

    function $onInit() {
      vm.personAttributes = patientService.getPersonAttributesForStep('testing');
    }

  }

})();
