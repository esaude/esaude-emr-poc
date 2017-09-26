(function () {
  'use strict';

  angular
    .module('registration')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$location', '$stateParams', 'notifier', 'patientService', 'translateFilter'];

  /* @ngInject */
  function DashboardController($location, $stateParams, notifier, patientService, translateFilter) {

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
      $location.url("/search"); // path not hash
    }

    function linkVisit() {
      $location.url("/visit/" + patientUUID); // path not hash
    }

    function linkPatientDetail() {
      $location.url("/patient/detail/" + patientUUID); // path not hash
    }

    function linkServicesList() {
      $location.url("/services/" + patientUUID); // path not hash
    }

    function linkPatientEdit() {
      $location.url("/patient/edit/" + patientUUID + "/identifier"); // path not hash
    }

    function getPatient(uuid) {
      return patientService.getPatient(uuid);
    }
  }

})();

