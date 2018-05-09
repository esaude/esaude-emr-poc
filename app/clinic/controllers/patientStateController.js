(function () {
  'use strict';

  angular.module('clinic')
    .controller('PatientStateController', PatientStateController);

  PatientStateController.$inject = ['$rootScope', '$stateParams', 'encounterService', 'observationsService',
    'commonService', '$filter',  'prescriptionService', 'patientService'];

  /* @ngInject */
  function PatientStateController($rootScope, $stateParams, encounterService, observationsService, commonService,
                                    $filter,  prescriptionService, patientService) {
    var patientUuid = $stateParams.patientUuid;
    var patient = {};
    var vm = this;

    vm.observations = [];

    activate();

    ////////////////

    function activate() {
      processLastObs()
    }

    function processLastObs() {

      var configObservations = [
          {label: "CLINIC_LAST_CD4_COUNT", uuid: "e1e68f26-1d5f-11e0-b929-000c29ad1d07"},
          {label: "CLINIC_LAST_VIRAL_LOAD", uuid: "e1d6247e-1d5f-11e0-b929-000c29ad1d07"},
          {label: "CLINIC_LAST_TB_START_DATE", uuid: "e1d9fbda-1d5f-11e0-b929-000c29ad1d07"},
          {label: "CLINIC_PRESCRIPTION_CURRENT_REGIMEN", uuid: "e1d83d4a-1d5f-11e0-b929-000c29ad1d07"},
          {label: "CLINIC_CURRENT_WHO_STAGE", uuid: "e1e53c02-1d5f-11e0-b929-000c29ad1d07"}
      ];

      _.forEach(configObservations, function (observation) {
         observationsService.getLastValueForConcept(patientUuid, observation.uuid, "full").then(function (data) {
          if (!_.isUndefined(data)) {
            if (_.isObject(data.value)) {
              observation.value = data.value.display;
            } else {
              observation.value = data.value;
            }
            observation.date = data.obsDatetime;
            vm.observations.push(observation);
          }
        });
      })
    }

    

    function getPatient() {
      return patientService.getPatient(patientUuid);
    }

  }

})();
