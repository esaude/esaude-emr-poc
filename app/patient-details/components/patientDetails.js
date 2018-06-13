(function () {
  'use strict';

  angular
    .module('patient.details')
    .component('patientDetails', {
      controller: PatientDetailsController,
      controllerAs: 'patientCommon',
      templateUrl: '../patient-details/components/patientDetails.html'
    });

  function PatientDetailsController($stateParams, $state, $rootScope, reportService, patientService, notifier,
                                    translateFilter, configurationService, patientRepresentation) {

    var patientUUID = $stateParams.patientUuid;
    var returnState = $stateParams.returnState;

    var vm = this;

    vm.patient = {};
    vm.addressLevels = [];

    vm.linkDashboard = linkDashboard;
    vm.print = print;
    vm.filterPersonAttributesForCurrStep = filterPersonAttributesForCurrStep;
    vm.$onInit = $onInit;

    ////////////////

    function $onInit() {
      getPatient(patientUUID)
        .then(function (patient) {
          vm.patient = patient;
        })
        .catch(function () {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });

      configurationService.getAddressLevels()
        .then(function (addressLevels) {
          vm.addressLevels = addressLevels;
        });
    }

    function linkDashboard() {
      $state.go(returnState, {patientUuid: patientUUID});
    }

    function print() {
      reportService.printPatientDailyHospitalProcess(vm.patient);
    }

    function getPatient(uuid) {
      return patientService.getPatient(uuid, patientRepresentation);
    }

    function filterPersonAttributesForCurrStep (step) {
      return patientService.filterPersonAttributesForCurrStep(step);
    }
  }

})();
