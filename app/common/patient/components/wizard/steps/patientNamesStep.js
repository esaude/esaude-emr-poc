(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientNamesStep', {
      bindings: {
        patient: '<',
        form: '<',
        showMessages: '<'
      },
      controller: PatientNamesStepController,
      controllerAs: 'vm',
      templateUrl: '../common/patient/components/wizard/steps/patientNamesStep.html'
    });

  /* @ngInject */
  function PatientNamesStepController(patientAttributeService, patientService) {

    var vm = this;

    vm.patientAttributes = [];

    vm.$onInit = $onInit;
    vm.getAutoCompleteList = getAutoCompleteList;
    vm.getDataResults = getDataResults;

    function $onInit() {
      vm.patientAttributes = patientService.getPersonAttributesForStep('name');
    }

    function getAutoCompleteList(attributeName, query, type) {
      return patientAttributeService.search(attributeName, query, type);
    }

    function getDataResults(data) {
      return data.results;
    }

  }

})();
