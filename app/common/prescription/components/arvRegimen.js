/**
 * Component for handling patient drug regime change.
 * It asks for the reason of change when the regime is changed and for interruption reason when the ART plan is interrupted.
 */
(() => {
  'use strict';

  angular
    .module('poc.common.prescription')
    .component('arvRegimen', {
      bindings: {
        patient: '<',
        prescription: '<',
        // Prescription ConvSet added here just to avoid reloading
        prescriptionConvSet: '<',
        disabled: '<',
        onTherapeuticLineChange: '&',
        onRegimeChange: '&',
        onArvPlanChange: '&',
      },
      controller: ArvRegimen,
      controllerAs: 'vm',
      templateUrl: '../common/prescription/components/arvRegimen.html',
    });

  /* @ngInject */
  function ArvRegimen($q, notifier, prescriptionService, translateFilter) {

    const vm = this;

    let initialRegime = null;

    vm.$onInit = $onInit;
    vm._onTherapeuticLineChange = _onTherapeuticLineChange;
    vm._onArvPlanChange = _onArvPlanChange;
    vm._onRegimeChange = _onRegimeChange;
    vm.onDrugRegimenChangeReasonChange = onDrugRegimenChangeReasonChange;
    vm.onArvPlanInterruptedReasonChange = onArvPlanInterruptedReasonChange;

    function $onInit() {
      if (vm.prescription.therapeuticLine) {
        initialRegime = vm.prescription.regime;
        vm.therapeuticLine = vm.prescription.therapeuticLine;
        vm.regime = vm.prescription.regime;
        vm.changeReason = vm.prescription.changeReason;
        vm.arvPlan = vm.prescription.arvPlan;
        vm.interruptedReason = vm.prescription.interruptionReason;
        loadRegimensByTherapeuticLine(vm.therapeuticLine);
      } else {
        loadPatientRegimen();
      }
    }

    function loadPatientRegimen() {
      prescriptionService.getPatientRegimen(vm.patient)
        .then(regimen => {
          initialRegime = regimen.regime;
          const therapeuticLine = regimen.therapeuticLine;
          const regime = regimen.regime;
          const arvPlan = regimen.arvPlan;
          vm.regime = regime;
          vm.therapeuticLine = therapeuticLine;
          vm.arvPlan = arvPlan;
          vm.onTherapeuticLineChange({therapeuticLine});
          vm.onRegimeChange({regime});
          vm.onArvPlanChange({arvPlan});
          return loadRegimensByTherapeuticLine(therapeuticLine);
        })
        .catch(() => {
          notifier.error(translateFilter('COMMON_ERROR'));
        });
    }

    function loadRegimensByTherapeuticLine(therapeuticLine) {
      prescriptionService.getRegimensByTherapeuticLine(vm.patient, therapeuticLine)
        .then(therapeuticLineRegimens => {
          vm.therapeuticLineRegimens = therapeuticLineRegimens;
        })
        .catch(() => {
          notifier.error(translateFilter('COMMON_ERROR'));
        });
    }

    function _onTherapeuticLineChange(therapeuticLine) {
      prescriptionService.getRegimensByTherapeuticLine(vm.patient, therapeuticLine)
        .then(therapeuticLineRegimens => {
          vm.therapeuticLineRegimens = therapeuticLineRegimens;
          vm.regime = null;
          vm.isTheraupeuticLineEdit = false;
          vm.isDrugRegimenEdit = true;
          vm.isDrugRegimenEditCancel = false;
        })
        .catch(() => {
          notifier.error(translateFilter('COMMON_ERROR'));
        });
      vm.onTherapeuticLineChange({therapeuticLine});
    }

    function _onArvPlanChange(arvPlan) {
      if (prescriptionService.isArtPlanInterrupt(arvPlan)) {
        vm.isPlanInterrupted = true;
        vm.isArtPlanInterruptedEdit = true;
      } else {
        vm.isArvPlanEdit = false;
        vm.isPlanInterrupted = false;
        vm.isArtPlanInterruptedEdit = false;
        vm.interruptedReason = null;
      }
      const interruptionReason = vm.interruptedReason;
      vm.onArvPlanChange({arvPlan, interruptionReason});
    }

    function _onRegimeChange(regime) {
      const changed = initialRegime ? regime.uuid !== initialRegime.uuid : true;
      if (changed) {
        vm.isDrugRegimenEditCancel = true;
        vm.isDrugRegimenChanged = !!initialRegime;
      } else {
        vm.isDrugRegimenEdit = false;
        vm.isDrugRegimenEditCancel = false;
        vm.isDrugRegimenChanged = false;
        vm.changeReason = null;
      }
      regime = changed ? regime : initialRegime;
      vm.onRegimeChange({regime});
    }

    function onDrugRegimenChangeReasonChange(changeReason) {
      vm.isDrugRegimenEdit = false;
      vm.onRegimeChange({regime: vm.regime, changeReason});
    }

    function onArvPlanInterruptedReasonChange(interruptedReason) {
      vm.isArtPlanInterruptedEdit = false;
      vm.isArvPlanEdit = false;
      vm.onArvPlanChange({arvPlan: vm.arvPlan, interruptionReason: interruptedReason});
    }
  }

})();
