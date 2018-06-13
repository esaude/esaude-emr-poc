(function () {
  'use strict';

  angular
    .module('application')
    .controller('SimilarPatientsController', SimilarPatientsController);

  SimilarPatientsController.$inject = ['$rootScope', '$scope', '$location', 'patientService', 'openmrsPatientMapper'];

  /* @ngInject */
  function SimilarPatientsController($rootScope, $scope, $location, patientService, openmrsPatientMapper) {

    var vm = this;
    vm.patient = $scope.patient;
    vm.similarPatients = [];

    vm.loadPatientToDashboard = loadPatientToDashboard;
    vm.refresh = refresh;

    ////////////////

    function refresh() {
      var query = vm.patient.givenName + ' ' + vm.patient.familyName;
      patientService.search(query).then(function (patients) {
        vm.similarPatients = openmrsPatientMapper.mapPatient(patients);
      });
    }

    function loadPatientToDashboard() {
      $rootScope.patient = vm.patient;
      $location.url("/dashboard/" + vm.patient.uuid);
    }
  }

})();
