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
  function PatientWizardController($rootScope, $scope, $stateParams, $location, $state, patient, patientService,
                                   appService, openmrsPatientMapper, notifier, TabManager, translateFilter) {

    var tabManager;

    var currentStep;

    var updating = false;

    var vm = this;

    vm.headerText = "PATIENT_INFO_NEW";
    vm.srefPrefix = "newpatient";
    vm.showMessages = false;
    vm.openMRSPatient = {};

    vm.$onInit = $onInit;
    vm.changeStep = changeStep;
    vm.linkCancel = linkCancel;
    vm.save = save;
    vm.stepForward = stepForward;
    vm.stepBackwards = stepBackwards;
    vm.setCurrentStep = setCurrentStep;
    vm.atLastStep = atLastStep;
    vm.atFirstStep = atFirstStep;

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

      tabManager = new TabManager();
      tabManager.addStepDefinition('identifier');
      tabManager.addStepDefinition('name');
      tabManager.addStepDefinition('gender');
      tabManager.addStepDefinition('age');
      tabManager.addStepDefinition('address');
      tabManager.addStepDefinition('other');
      tabManager.addStepDefinition('testing');
      tabManager.addStepDefinition('confirm');
    }

    // TODO handle navigating directly to a step that is not the first.
    function setCurrentStep(s) {
      if (!s.getName) {
        throw new Error(`Step '${s.constructor.name}' should implement getName()`);
      }
      currentStep = s;
    }

    function getStepStateName(name) {
      return `${vm.srefPrefix}.${name}`;
    }

    function linkCancel() {
      if (updating) {
        $state.go($stateParams.returnState, {patientUuid: vm.patient.uuid});
      } else {
        $state.go('search');
      }
    }

    function create() {
      patientService.createPatientProfile(vm.patient)
        .then(patientProfile => {
          notifier.success(translateFilter('COMMON_PATIENT_CREATED'));
          $state.go('dashboard', {patientUuid: patientProfile.patient.uuid});
        })
        .catch(() => {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function update() {
      patientService.updatePatientProfile(vm.patient, vm.openMRSPatient)
        .then(() => {
          notifier.success(translateFilter('COMMON_PATIENT_UPDATED'));
          $state.go($stateParams.returnState, {patientUuid: vm.patient.uuid});
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

    function changeStep (toStepName) {
      var currentStepName = currentStep.getName();

      var stepingForward = tabManager.isStepingForward(currentStepName, toStepName);
      var jumpingMoreThanOneTab = tabManager.isJumpingMoreThanOneTab(currentStepName, toStepName);

      if (!stepingForward || (stepingForward && !jumpingMoreThanOneTab && currentStep.form.$valid)) {
        vm.showMessages = false;
        $state.go(getStepStateName(tabManager.goToStep(toStepName)));
      } else if (stepingForward && jumpingMoreThanOneTab) {
        notifier.warning("", translateFilter('FOLLOW_SEQUENCE_OF_TABS'));
      } else {
        vm.showMessages = true;
      }
    }

    function stepForward() {
      if (currentStep.form.$valid) {
        vm.showMessages = false;
        $state.go(getStepStateName(tabManager.stepForward()));
      } else {
        vm.showMessages = true;
      }
    }

    function stepBackwards() {
      $state.go(getStepStateName(tabManager.stepBackwards()));
    }

    function atLastStep() {
      return currentStep && tabManager.isLastStep(currentStep.getName());
    }

    function atFirstStep() {
      return currentStep && tabManager.isFirstStep(currentStep.getName());
    }

  }

})();
