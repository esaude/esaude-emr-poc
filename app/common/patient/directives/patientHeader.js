(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientHeader', {
      controller: PatientHeaderController,
      controllerAs: 'vm',
      bindings: {
        patient: '<',
        displayActions: '<',
        onPatientDeceased: '&'
      },
      templateUrl: '../common/patient/directives/patientHeader.html'
    });

  /* @ngInject */
  function PatientHeaderController($state, $filter, $uibModal, conceptService, notifier, patientService) {
    var vm = this;

    vm.linkPatientDetail = linkPatientDetail;
    vm.linkPatientEdit = linkPatientEdit;
    vm.linkSearch = linkSearch;
    vm.openPatientDeleteModal = openPatientDeleteModal;

    function linkPatientDetail() {
      $state.go('detailpatient', {
        patientUuid: vm.patient.uuid,
        returnState: $state.current
      });
    }


    function linkPatientEdit() {
      $state.go('editpatient.identifier', {
        patientUuid: vm.patient.uuid,
        returnState: $state.current
      });
    }

    function openPatientDeleteModal() {
      var modalInstance = $uibModal.open({
        component: 'patientDeleteModal',
        resolve: {
          patient: function () {
            return vm.patient;
          }
        }
      });

      modalInstance.result
        .then(function (deleteData) {
          if (deleteData.dead) {
            return deceasedPatient(deleteData.deathDate, deleteData.causeOfDeath);
          } else {
            return deletePatient(deleteData.deleteReason);
          }
        })
        .then(function () {
          notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
        });
    }

    function deceasedPatient(date, causeOfDeath) {
      return patientService.updatePerson(vm.patient.uuid, {dead: true, deathDate: date, causeOfDeath: causeOfDeath})
        .then(function () {
          vm.onPatientDeceased(vm.patient);
        })
        .catch(function (error) {
          notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function deletePatient(reason) {
      return patientService.voidPatient(vm.patient.uuid, reason)
        .then(function () {
          linkSearch();
        })
        .catch(function (error) {
          notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function linkSearch() {
      $state.go('search');
    }

  }

})();

