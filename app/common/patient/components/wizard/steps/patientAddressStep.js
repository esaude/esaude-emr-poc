(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientAddressStep', {
      bindings: {
        patient: '<'
      },
      controller: PatientAddressStepController,
      controllerAs: 'vm',
      require: {
        patientWizard: '^^',
      },
      templateUrl: '../common/patient/components/wizard/steps/patientAddressStep.html',
    });

  /* @ngInject */
  function PatientAddressStepController(configurationService) {

    var vm = this;

    var NAME = 'address';

    vm.addressLevels = [];

    vm.$onInit = $onInit;
    vm.getName = getName;
    vm.shouldShowMessages = shouldShowMessages;

    function $onInit() {
      vm.patientWizard.setCurrentStep(vm);

      configurationService.getAddressLevels()
        .then(function (addressLevels) {
          vm.addressLevels = addressLevels;
        });
    }

    function getName() {
      return NAME;
    }

    function shouldShowMessages() {
      return vm.patientWizard.showMessages;
    }
  }

})();
