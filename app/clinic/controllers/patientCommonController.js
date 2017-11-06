(function () {
  'use strict';

  angular
    .module('clinic')
    .controller('PatientCommonController', PatientCommonController);

  PatientCommonController.$inject = ['$filter', '$scope', 'conceptService', 'notifier', 'patientService', 'spinner'];


  /* @ngInject */
  function PatientCommonController($filter, $scope, conceptService, notifier, patientService, spinner) {

    var now = new Date();

    var vm = this;
    vm.deathDatepickerOptions = {maxDate: now};
    vm.deathConcepts = [];
    vm.patient = $scope.patient;

    vm.deceasedPatient = deceasedPatient;
    vm.deletePatient = deletePatient;
    vm.disableIsDead = disableIsDead;
    vm.getDeathConcepts = getDeathConcepts;

    vm.selectIsDead = selectIsDead;

    activate();

    ////////////////

    function activate() {
      var load = getDeathConcepts().then(function () {
        return vm.getDeathConcepts();
      });

      spinner.forPromise(load);
    }

    function successCallback() {
      notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
    }
    function failureCallback() {
      notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
    }

    function disableIsDead() {
      return (vm.patient.causeOfDeath !== null || vm.patient.deathDate !== null) && vm.patient.dead;
    }

    function selectIsDead() {
      if (vm.patient.causeOfDeath !== null || vm.patient.deathDate !== null) {
        vm.patient.dead = true;
      }
    }

    function getDeathConcepts() {
      return conceptService.getDeathConcepts()
        .then(function(deathConcepts) {
          vm.deathConcepts = deathConcepts;
        }).catch(function(error) {
          notifier.error(($filter('translate')('COMMON_MESSAGE_ERROR_ACTION')));
        });
    }

    function deceasedPatient() {
      var patientState = {
        dead: true,
        causeOfDeath: vm.patient.causeOfDeath.uuid,
        deathDate:vm.patient.deathDate
      };
      patientService.updatePerson(vm.patient.uuid, patientState)
        .then(successCallback)
        .catch(failureCallback);
      $(function () {
        $('#deletePatientModal').modal('toggle');
      });
    }

    function deletePatient() {
      patientService.voidPatient(vm.patient.uuid, vm.deleteReason)
        .then(successCallback, failureCallback);
      $(function () {
        $('#deletePatientModal').modal('toggle');
      });
    }

  }

})();
