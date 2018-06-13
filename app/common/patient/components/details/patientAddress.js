(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientAddress', {
      bindings: {
        patient: '<'
      },
      controller: PatientAddressController,
      controllerAs: 'vm',
      templateUrl: '../common/patient/components/details//patientAddress.html',
    });

  function PatientAddressController(configurationService) {

    var vm = this;

    vm.addressLevels = [];

    vm.$onInit = $onInit;

    function $onInit() {
      configurationService.getAddressLevels()
        .then(function (addressLevels) {
          vm.addressLevels = addressLevels;
        });
    }
  }

})();
