(function () {
  'use strict';

  angular
    .module('application')
    .controller('SimilarPatientsController', SimilarPatientsController);

  SimilarPatientsController.$inject = ['$scope', '$state', 'patientService', 'openmrsPatientMapper'];

  /* @ngInject */
  function SimilarPatientsController($scope, $state, patientService, openmrsPatientMapper) {

    var vm = this;
    vm.patient = $scope.patient;
    vm.similarPatients = [];

    vm.loadPatientToDashboard = loadPatientToDashboard;
    vm.refresh = refresh;


    function refresh() {
      var query = vm.patient.givenName + ' ' + vm.patient.familyName;
      patientService.search(query).then(patients => {
        vm.similarPatients = openmrsPatientMapper.mapPatient(patients);
      });
    }

    function loadPatientToDashboard(patient) {
      $state.go('dashboard', {patientUuid: patient.uuid});
    }
  }

})();
