(function () {
  //TODO: this will be unnecessary once we remove pollution on $rootScope.
  // Just use the route param for patient UUID!
  'use strict';

  angular
    .module('application')
    .controller('MovePatientController', MovePatientController);

  MovePatientController.$inject = ['$rootScope', '$scope', '$location', 'patientService', 'spinner', 'visitService',
    'localStorageService'];

  /* @ngInject */
  function MovePatientController($rootScope, $scope, $location, patientService, spinner, visitService,
                                 localStorageService) {

    $scope.results = [];

    activate();

    ////////////////

    function activate() {
      var movingPatient = localStorageService.get('movingPatient');

      localStorageService.remove('movingPatient');
      spinner.forPromise(patientService.getPatient(movingPatient).then(function (patient) {
        $rootScope.patient = patient;
        redirectToPage(patient);
      }));
    }

    function redirectToPage(patient) {
      visitService.getTodaysVisit(patient.uuid).then(function (visitToday) {
        if (visitToday) {
          $rootScope.hasVisitToday = true;
          $rootScope.todayVisit = visitToday;
        } else {
          $rootScope.hasVisitToday = false;
        }
        $location.url(eval($rootScope.landingPageAfterSearch)); // path not hash
      });
    }
  }

})();

