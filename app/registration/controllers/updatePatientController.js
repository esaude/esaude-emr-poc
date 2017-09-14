(function () {
  'use strict';

  angular
    .module('registration')
    .controller('UpdatePatientController', UpdatePatientController);

  UpdatePatientController.$inject = ['$filter', '$scope', '$location', '$state', '$stateParams', 'patient', 'patientService', 'notifier'];

  /* @ngInject */
  function UpdatePatientController($filter, $scope, $location, $state, $stateParams, patient, patientService, notifier) {

    var uuid = $stateParams.patientUuid;

    $scope.patient = patient;
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
      $state.go('dashboard', {patientUuid: uuid});
    }

    function save() {
      patientService.update($scope.patient, $scope.openMRSPatient).success(successCallback).error(errorCallback);
    }

    function successCallback(patientProfileData) {
      //update patient identifier
      _.forEach (patientProfileData.patient.identifiers, function (oldIdentifier) {
        var found = _.find ($scope.patient.identifiers, function (identifier) {
          return identifier.identifierType.uuid === oldIdentifier.identifierType.uuid;
        });

        if (_.isUndefined(found)) {

        } else {
          //check if value was changed
          if (found.identifier !== oldIdentifier.identifier) {
            patientService.updatePatientIdentifier(patientProfileData.patient.uuid, oldIdentifier.uuid,
              {identifier: found.identifier, uuid: oldIdentifier.uuid, preferred: found.preferred}).success(successIdentifierCallback);
          }
        }
      });
      $scope.patient.uuid = patientProfileData.patient.uuid;
      $scope.patient.name = patientProfileData.patient.person.names[0].display;
      $scope.patient.isNew = false;
      $location.url("/dashboard/" + $scope.patient.uuid);
    }

    function errorCallback() {
      notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
    }

    function successIdentifierCallback(identifierProfileData) {
      var foundIdentifier = _.find($scope.patient.identifiers, function (identifier) {
        return identifier.uuid === identifierProfileData.uuid;
      });

      foundIdentifier.identifier = identifierProfileData.identifier;
      foundIdentifier.preferred = identifierProfileData.preferred;
      notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
    }

  }

})();

