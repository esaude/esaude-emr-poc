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
    vm.linkSearch = linkSearch;
    vm.linkVisit = linkVisit;
    vm.linkPatientDetail = linkPatientDetail;
    vm.linkServicesList = linkServicesList;
    vm.linkPatientEdit = linkPatientEdit;

    activate();

    ////////////////

    function activate() {
      getPatient(patientUUID)
        .then(function (patient) {
          vm.patient = patient;
        })
        .catch(function () {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function linkSearch() {
      $state.go('search');
    }

    function linkVisit() {
      $state.go('visit', {patientUuid: patientUUID});
    }

    function linkPatientDetail() {
      $state.go('detailpatient', {
        patientUuid: patientUUID,
        returnState: $state.current
      });
    }

    function linkServicesList() {
      $state.go('services', {patientUuid: patientUUID});
    }

    function linkPatientEdit() {
      $state.go('editpatient.identifier', {
        patientUuid: patientUUID,
        returnState: $state.current
      });
    }

    function getPatient(uuid) {
      return patientService.getPatient(uuid);
    }
  }

})();

