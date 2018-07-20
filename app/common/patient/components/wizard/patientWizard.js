(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientWizard', {
      bindings: {
        patient: '<'
      },
      controller: PatientWizardController,
      controllerAs: 'vm',
      templateUrl: '../common/patient/components/wizard/patientWizard.html',
    });

  /* @ngInject */
  function PatientWizardController($stateParams, $state, patientService,
    notifier, translateFilter) {

    var updating = false;

    var vm = this;

    vm.headerText = "PATIENT_INFO_NEW";
    vm.srefPrefix = "newpatient";
    vm.showMessages = false;
    vm.openMRSPatient = {};

    vm.$onInit = $onInit;
    vm.linkCancel = linkCancel;
    vm.save = save;
    vm.setShowMessage = setShowMessage;

    function $onInit() {

      updating = !!vm.patient.uuid;

      if (updating) {
        vm.srefPrefix = 'editpatient';
        vm.headerText = "PATIENT_INFO_EDIT";

        patientService.getOpenMRSPatient(vm.patient.uuid)
          .then(patient => {
            vm.openMRSPatient = patient;
          })
          .catch(() => {
            notifier.error(translateFilter('COMMON_COULD_NOT_LOAD_PATIENT'));
            $state.go($stateParams.returnState);
          });
      }
    }

    function linkCancel() {
      if (updating) {
        $state.go($stateParams.returnState, { patientUuid: vm.patient.uuid });
      } else {
        $state.go('search');
      }
    }

    function create() {
      patientService.createPatientProfile(vm.patient)
        .then(patientProfile => {
          notifier.success(translateFilter('COMMON_PATIENT_CREATED'));
          $state.go('dashboard', { patientUuid: patientProfile.patient.uuid });
        })
        .catch(error => {
          if (error.errorType) {
            notifier.error(translateFilter(error.errorType, { nid: error.nid }));
          } else {
            notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
          }
        });
    }

    function update() {
      patientService.updatePatientProfile(vm.patient, vm.openMRSPatient)
        .then(() => {
          notifier.success(translateFilter('COMMON_PATIENT_UPDATED'));
          $state.go($stateParams.returnState, { patientUuid: vm.patient.uuid });
        })
        .catch(() => {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function save() {
      if (updating) {
        update();
      } else {
        create();
      }
    }

    function setShowMessage(showMessage) {
      vm.showMessages = showMessage;
    }

  }

})();
