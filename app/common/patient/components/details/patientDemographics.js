(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientDemographics', {
      bindings: {
        patient: '<'
      },
      controller: PatientDemographicsController,
      controllerAs: 'vm',
      templateUrl: '../common/patient/components/details//patientDemographics.html',
    });

  /* @ngInject */
  function PatientDemographicsController(patientService) {

    var vm = this;

    vm.personAttributes = [];

    vm.$onInit = $onInit;

    function $onInit() {
      vm.personAttributes = patientService.getPersonAttributesForStep('name');
    }

  }

})();
