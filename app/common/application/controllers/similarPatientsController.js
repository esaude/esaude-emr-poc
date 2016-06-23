(function() {
  'use strict';

  angular.module('application')
    .controller('SimilarPatients', ['$rootScope', '$scope', '$location', 'patientService', 'openmrsPatientMapper',
      function ($rootScope, $scope, $location, patientService, patientMapper) {

        $scope.givenName = '';
        $scope.familyName = '';
        $scope.result = [];

        $scope.refresh = function () {
          var query = $scope.givenName + ' ' + $scope.familyName;
          var searchPromise = patientService.search(
            query).success(function (data) {
            $scope.result = mapPatient(data.results);
          });
        };

        $scope.loadPatientToDashboard = function (patient) {
          $rootScope.patient = patient;
          $location.url("/dashboard/" + patient.uuid);
        };


        function mapPatient(results) {
          //prepare results to be presented in search table
          var preparedResults = [];
          for (var patientIndex in results) {
            var result = results[patientIndex];
            var patient = patientMapper.map(result);

            preparedResults.push(patient);
          }
          return preparedResults;
        }


      }]);
})();
