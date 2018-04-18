(function () {
  'use strict';

  angular
    .module('registration')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$state', '$stateParams', 'notifier', 'patientService', 'translateFilter'];

  /* @ngInject */
  function DashboardController($state, $stateParams, notifier, patientService, translateFilter) {

    var patientUUID = $stateParams.patientUuid;

    var vm = this;

    vm.patient = {};

    vm.linkSearch = linkSearch;
    vm.loadPatient = loadPatient;

    activate();

    ////////////////

    function activate() {
      loadPatient();
    }

    function linkSearch() {
      $state.go('search');
    }

    function loadPatient() {
      return getPatient(patientUUID)
        .then(function (patient) {
          vm.patient = patient;
        })
        .catch(function () {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }


    function getPatient(uuid) {
      return patientService.getPatient(uuid);
    }
  }

})();

