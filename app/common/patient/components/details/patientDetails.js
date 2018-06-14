(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientDetails', {
      controller: PatientDetailsController,
      controllerAs: 'vm',
      templateUrl: '../common/patient/components/details//patientDetails.html'
    });

  function PatientDetailsController($stateParams, $state, reportService, patientService, notifier, translateFilter,
                                    patientRepresentation) {

    var vm = this;

    vm.patient = {};
    vm.addressLevels = [];

    vm.$onInit = $onInit;
    vm.linkDashboard = linkDashboard;
    vm.print = print;

    ////////////////

    function $onInit() {
      getPatient($stateParams.patientUuid)
        .then(function (patient) {
          vm.patient = patient;
        })
        .catch(function () {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function linkDashboard() {
      $state.go($stateParams.returnState, {patientUuid: $stateParams.patientUuid});
    }

    function print() {
      reportService.printPatientDailyHospitalProcess(vm.patient);
    }

    function getPatient(uuid) {
      return patientService.getPatient(uuid, patientRepresentation);
    }
  }

})();
