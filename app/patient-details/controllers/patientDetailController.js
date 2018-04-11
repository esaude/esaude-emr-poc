(function () {
  'use strict';

  angular.module('patient.details')
    .controller('DetailPatientController', DetailPatientController);

  DetailPatientController.$inject = ["$stateParams", "$state", "$scope", "reportService", "patientService",
    "notifier", "translateFilter", "configurations", "appService"];

  function DetailPatientController($stateParams, $state, $scope, reportService, patientService, notifier,
                                   translateFilter, configurations, appService) {

    var patientUUID = $stateParams.patientUuid;
    var patientConfiguration = $scope.patientConfiguration;
    var returnState = $stateParams.returnState;

    var vm = this;

    vm.patient = {};
    vm.addressLevels = configurations.addressLevels();
    vm.patientAttributes = [];
    vm.linkDashboard = linkDashboard;
    vm.print = print;
    vm.filterPersonAttributesForDetails = filterPersonAttributesForDetails;
    vm.additionalPatientAttributes = appService.getAppDescriptor().getConfigValue("additionalPatientAttributes");

    activate();

    ////////////////

    function activate() {
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

    function filterPersonAttributesForDetails (attributes, stepConfigAttrs) {
      return patientService.filterPersonAttributesForDetails (attributes, stepConfigAttrs);
    }
  }
})();
