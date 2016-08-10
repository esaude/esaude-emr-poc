(function() {
  'use strict';

  angular.module('application')
    .controller('SimilarPatientsController', ['$rootScope', '$scope', '$location', 'patientService', 'openmrsPatientMapper',
      function ($rootScope, $scope, $location, patientService, patientMapper) {

        $scope.result = [];

        $scope.refresh = function () {
          var query = $scope.patient.givenName + ' ' + $scope.patient.familyName;
          var searchPromise = patientService.search(
            query).success(function (data) {
            $scope.result = patientMapper.mapPatient(data.results);
          });
        };

        $scope.loadPatientToDashboard = function (patient) {
          $rootScope.patient = patient;
          $location.url("/dashboard/" + patient.uuid);
        };
      }]);
})();
