(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientNamesStep', {
      bindings: {
        patient: '<'
      },
      controller: PatientNamesStepController,
      controllerAs: 'vm',
      require: {
        patientWizard: '^^',
      },
      templateUrl: '../common/patient/components/wizard/steps/patientNamesStep.html',
    });

  /* @ngInject */
  function PatientNamesStepController(patientAttributeService, patientService) {

    var vm = this;

    var NAME = 'name';

    vm.patientAttributes = [];

    vm.$onInit = $onInit;
    vm.getAutoCompleteList = getAutoCompleteList;
    vm.getDataResults = getDataResults;
    vm.getName = getName;
    vm.shouldShowMessages = shouldShowMessages;

    function $onInit() {
      vm.patientWizard.setCurrentStep(vm);
      vm.patientAttributes = patientService.getPersonAttributesForStep('name');
    }

    function getAutoCompleteList(attributeName, query, type) {
      return patientAttributeService.search(attributeName, query, type);
    }

    function getDataResults(data) {
      return data.results;
    }

    function getName() {
      return NAME;
    }

    function shouldShowMessages() {
      return vm.patientWizard.showMessages;
    }
  }

})();
