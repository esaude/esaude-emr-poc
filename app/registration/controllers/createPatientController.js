(function () {
  'use strict';

  angular
    .module('registration')
    .controller('CreatePatientController', CreatePatientController);

  CreatePatientController.$inject = ['$rootScope', '$scope', '$location', '$filter', '$state', 'patient',
    'patientService', 'appService', 'openmrsPatientMapper', 'notifier'];

  /* @ngInject */
  function CreatePatientController($rootScope, $scope, $location, $filter, $state, patient, patientService, appService,
                                   openmrsPatientMapper, notifier) {

    $scope.actions = {};
    $scope.addressHierarchyConfigs = appService.getAppDescriptor().getConfigValue("addressHierarchy");
    $scope.patient = patient.create();
    $scope.srefPrefix = "newpatient.";

    $scope.linkCancel = linkCancel;
    $scope.save = save;

    ////////////////

    function linkCancel() {
      $state.go('search');
    }

    function save() {
      var errMsg = Bahmni.Common.Util.ValidationUtil
        .validate($scope.patient,$scope.patientConfiguration.personAttributeTypes);
      if(errMsg){
        return;
      }

      patientService.create($scope.patient).success(successCallback).error(errorCallback);
    }

    function successCallback(patientProfileData) {
      $rootScope.patient = openmrsPatientMapper.map(patientProfileData.patient);
      $scope.patient.uuid = patientProfileData.patient.uuid;
      $scope.patient.name = patientProfileData.patient.person.names[0].display;
      $scope.patient.isNew = true;
      var successMessage = $filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED');
      notifier.success(successMessage);
      $location.url("/dashboard/" + $scope.patient.uuid);
    }

    function errorCallback() {
      notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
    }

  }

})();
