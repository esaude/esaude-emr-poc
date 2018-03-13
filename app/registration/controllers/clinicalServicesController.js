(function () {
  'use strict';

  angular
    .module('registration')
    .controller('ClinicalServicesController', ClinicalServicesController);

  ClinicalServicesController.$inject = ['$stateParams', 'notifier', 'patientService', 'translateFilter'];

  /* @ngInject */
  function ClinicalServicesController($stateParams) {

    var vm = this;
    vm.patient = {};

    activate();

    ////////////////

    function activate() {
      vm.patient = {uuid: $stateParams.patientUuid};
    }
  }

})();
