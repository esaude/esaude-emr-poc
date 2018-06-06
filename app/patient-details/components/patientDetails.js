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
                                    translateFilter, configurationService, appService) {

    var patientUUID = $stateParams.patientUuid;
    var patientConfiguration = appService.getPatientConfiguration();
    var returnState = $stateParams.returnState;

    var vm = this;

    vm.patient = {};
    vm.addressLevels = [];
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
      return patientService.getPatient(uuid);
    }

    function filterPersonAttributesForDetails (attributes, configAttr) {
      return patientService.filterPersonAttributesForDetails (attributes, configAttr);
    }
  }

})();
