(function () {
  'use strict';

  angular
    .module('registration')
    .controller('ClinicalServicesController', ClinicalServicesController);

  ClinicalServicesController.$inject = ['$stateParams', 'notifier', 'patientService', 'translateFilter'];

  /* @ngInject */
  function ClinicalServicesController($stateParams, notifier, patientService, translateFilter) {

    var vm = this;
    vm.patient = {};

    activate();

    ////////////////

    function activate() {
      getPatient();
    }

    function getPatient() {
      return patientService.getPatient($stateParams.patientUuid)
        .then(function (patient) {
          vm.patient = patient;
        })
        .catch(function () {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'))
        });
    }
  }

})();

