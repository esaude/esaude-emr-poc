(function () {
  'use strict';

  angular
    .module('application')
    .controller('SimilarPatientsController', SimilarPatientsController);

  SimilarPatientsController.$inject = ['$rootScope', '$scope', '$location', 'patientService', 'openmrsPatientMapper', '$state'];

  /* @ngInject */
  function SimilarPatientsController($rootScope, $scope, $location, patientService, openmrsPatientMapper, $state) {

    var vm = this;
    vm.patient = $scope.patient;
    vm.similarPatients = [];

    vm.loadPatientToDashboard = loadPatientToDashboard;
    vm.refresh = refresh;


    function refresh() {
      var query = vm.patient.givenName + ' ' + vm.patient.familyName;
      patientService.search(query).then(function (patients) {
        vm.similarPatients = openmrsPatientMapper.mapPatient(patients);
      });
    }

    function loadPatientToDashboard(patient) {
      $state.go('dashboard', {patientUuid: patient.uuid});
    }
  }

})();
