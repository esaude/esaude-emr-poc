(function () {
  'use strict';

  angular
    .module('pharmacy')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$rootScope', '$location', '$stateParams', 'patientService', 'openmrsPatientMapper'];

  function DashboardController($rootScope, $location, $stateParams, patientService, openmrsPatientMapper)
  {
    var patientUuid;

    var vm = this;
    vm.linkPatientDetail = linkPatientDetail;
    vm.linkSearch = linkSearch;
    vm.print = print;

    activate();

    ////////////////

    function activate() {
      patientUuid = $stateParams.patientUuid;

      patientService.get(patientUuid).success(function (data) {
        $rootScope.patient = openmrsPatientMapper.map(data);
      });
    }

    function linkSearch() {
      $location.url("/search"); // path not hash
    }

    function linkPatientDetail() {
      $location.url("/patient/detail/" + patientUuid + "/demographic"); // path not hash
    }

    function print() {
      alert('print');
    }
  }

})();
