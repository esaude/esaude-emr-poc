(function () {
  'use strict';

  angular.module('patient.details')
    .controller('DetailPatientController', DetailPatientController);

  DetailPatientController.$inject = ["$stateParams", "$location", "reportService", "patientService",
    "notifier", "translateFilter"];

  function DetailPatientController($stateParams, $location, reportService, patientService, notifier,
                                   translateFilter) {

    var patientUUID = $stateParams.patientUuid;

    var vm = this;

    vm.patient = {};
    vm.linkDashboard = linkDashboard;
    vm.print = print;

    activate();

    ////////////////

    function activate() {
      getPatient(patientUUID)
        .then(function (patient) {
          vm.patient = patient;
        })
        .catch(function () {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function linkDashboard() {
      $location.url("/dashboard/" + patientUUID); // path not hash
    }

    function print() {
      reportService.printPatientDailyHospitalProcess(vm.patient);
    }

    function getPatient(uuid) {
      return patientService.getPatient(uuid);
    }
  }
})();
