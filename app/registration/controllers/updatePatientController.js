(function () {
  'use strict';

  angular
    .module('registration')
    .controller('UpdatePatientController', UpdatePatientController);

  UpdatePatientController.$inject = ['$filter', '$scope', '$state', '$stateParams', 'patient', 'patientService', 'notifier', 'appService'];

  /* @ngInject */
  function UpdatePatientController($filter, $scope, $state, $stateParams, patient, patientService, notifier, appService) {

    var returnState = $stateParams.returnState;
    var uuid = $stateParams.patientUuid;


    $scope.headerText = "PATIENT_INFO_EDIT";
    $scope.patient = patient;
    $scope.patientConfiguration = appService.getPatientConfiguration();
    $scope.openMRSPatient = {};
    $scope.srefPrefix = "editpatient.";

    $scope.linkCancel = linkCancel;
    $scope.save = save;

    activate();

    ////////////////

    function activate() {
      patientService.getOpenMRSPatient(uuid).then(function (patient) {
        $scope.openMRSPatient = patient;
      });
    }

    function linkCancel() {
      $state.go(returnState, {patientUuid: uuid});
    }

    function save() {
      patientService.update($scope.patient, $scope.openMRSPatient).then(successCallback).catch(errorCallback);
    }

    function successCallback(patientProfileData) {
      $scope.patient.uuid = patientProfileData.patient.uuid;
      $scope.patient.name = patientProfileData.patient.person.names[0].display;
      $scope.patient.isNew = false;
      notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
      $state.go(returnState, {patientUuid: uuid});
    }

    function errorCallback() {
      notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
    }

  }

})();
