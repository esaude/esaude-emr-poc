(function () {
  'use strict';

  angular
    .module('pharmacy')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$rootScope', '$location', '$stateParams', 'patientService', 'openmrsPatientMapper', 'reportService', '$log'];

  function DashboardController($rootScope, $location, $stateParams, patientService, openmrsPatientMapper, reportService, $log)
  {
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
        // This is needed because its tied to CheckinController.
        $rootScope.patient = vm.patient;
      });
    }

    function linkSearch() {
      $location.url("/search"); // path not hash
    }

    function linkPatientDetail() {
      $location.url("/patient/detail/" + patientUuid + "/demographic"); // path not hash
    }
  }

})();
