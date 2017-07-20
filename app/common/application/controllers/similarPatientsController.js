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
      patientService.search(query).success(function (data) {
        vm.similarPatients = openmrsPatientMapper.mapPatient(data.results);
      });
    }

    function loadPatientToDashboard() {
      $rootScope.patient = patient;
      $location.url("/dashboard/" + patient.uuid);
    }
  }

})();
