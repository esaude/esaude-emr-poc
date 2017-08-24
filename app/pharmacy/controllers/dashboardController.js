(function () {
  'use strict';

  angular
    .module('pharmacy')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$location', '$stateParams', 'patientService'];

  function DashboardController($location, $stateParams, patientService) {
    var patientUuid = $stateParams.patientUuid;

    var vm = this;
    vm.linkPatientDetail = linkPatientDetail;
    vm.linkSearch = linkSearch;
    vm.patient = {};
    vm.print = print;

    activate();

    ////////////////

    function activate() {
      patientService.getPatient(patientUuid).then(function (patient) {
        vm.patient = patient;
      });
    }

    function linkSearch() {
      $location.url("/search"); // path not hash
    }

    function linkPatientDetail() {
      $location.url("/patient/detail/" + patientUuid); // path not hash
    }
  }

})();
