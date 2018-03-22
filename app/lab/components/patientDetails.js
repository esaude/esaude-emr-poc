(function () {
  'use strict';

  // TODO: move this component to patient.details module.
  angular
    .module('lab')
    .component('patientDetails', {
      controller: PatientDetailsController,
      controllerAs: 'patientCommon',
      templateUrl: '../lab/components/patientDetails.html'
    });

  PatientDetailsController.$inject = ["$stateParams", "$state", "$rootScope", "reportService", "patientService",
    "notifier", "translateFilter", "configurations"];

  function PatientDetailsController($stateParams, $state, $rootScope, reportService, patientService, notifier,
                                    translateFilter, configurations) {

    var patientUUID = $stateParams.patientUuid;
    var patientConfiguration = $rootScope.patientConfiguration;
    var returnState = $stateParams.returnState;

    var vm = this;

    vm.patient = {};
    vm.addressLevels = configurations.addressLevels();
    vm.patientAttributes = [];

    vm.linkDashboard = linkDashboard;
    vm.print = print;
    vm.$onInit = $onInit;

    ////////////////

    function $onInit() {
      getPatient(patientUUID)
        .then(function (patient) {
          vm.patient = patient;
          vm.patientAttributes = patientConfiguration.customAttributeRows().reduce(function (acc, cur) {
            return acc.concat(cur);
          }, []);
        })
        .catch(function () {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function linkDashboard() {
      $state.go(returnState, {patientUuid: patientUUID});
    }

    function print() {
      reportService.printPatientDailyHospitalProcess(vm.patient);
    }

    function getPatient(uuid) {
      return patientService.getPatient(uuid);
    }
  }

})();
