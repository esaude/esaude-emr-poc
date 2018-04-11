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
    "notifier", "translateFilter", "configurations", "appService"];

  function PatientDetailsController($stateParams, $state, $rootScope, reportService, patientService, notifier,
                                    translateFilter, configurations, appService) {

    var patientUUID = $stateParams.patientUuid;
    var patientConfiguration = $rootScope.patientConfiguration;
    var returnState = $stateParams.returnState;

    var vm = this;

    vm.patient = {};
    vm.addressLevels = configurations.addressLevels();
    vm.patientAttributes = [];

    vm.linkDashboard = linkDashboard;
    vm.print = print;
    vm.filterPersonAttributesForDetails = filterPersonAttributesForDetails;
    vm.$onInit = $onInit;
    vm.additionalPatientAttributes = appService.getAppDescriptor().getConfigValue("additionalPatientAttributes");

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

    function filterPersonAttributesForDetails (attributes) {
      return patientService.filterPersonAttributesForDetails (attributes, vm.additionalPatientAttributes.other);
    }
  }

})();
