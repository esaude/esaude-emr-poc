(function () {
  //TODO: this will be unnecessary once we remove pollution on $rootScope.
  // Just use the route param for patient UUID!
  // Well as it is, because of the way this application is structured (modules are different angular apps) it is not
  // possible to simply point to another route. The only way to move patients is to store the patient data somewhere
  // outside the angular runtime and load it once the other app starts. :S
  // We really need to change this to the recommended architecture. {@link https://docs.angularjs.org/guide/module#recommended-setup}
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

