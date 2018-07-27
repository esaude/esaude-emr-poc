(() => {
  'use strict';

  angular
    .module('poc.common.prescription')
    .component('arvRegimen', {
      bindings: {
        patient: '<',
        therapeuticLine: '<',
        regime: '<',
        arvPlan: '<',
        prescriptionConvSet: '<',
        disabled: '<',
        onTherapeuticLineChange: '&',
        onDrugRegimenChange: '&',
        onArtPlanChange: '&',
      },
      controller: ArvRegimen,
      controllerAs: 'vm',
      templateUrl: '../common/prescription/components/arvRegimen.html',
    });

  /* @ngInject */
  function ArvRegimen($q, notifier, prescriptionService, translateFilter) {

    const vm = this;

    vm.$onChanges = $onChanges;
    vm._onTherapeuticLineChange = _onTherapeuticLineChange;
    vm._onArtPlanChange = _onArtPlanChange;
    vm._onDrugRegimenChange = _onDrugRegimenChange;
    vm.onDrugRegimenChangeReasonChange = onDrugRegimenChangeReasonChange;
    vm.onArvPlanInterruptedReasonChange = onArvPlanInterruptedReasonChange;

    function $onChanges(changesObj) {
      const therapeuticLineChanged = changesObj.therapeuticLine;
      const regimeChanged = changesObj.regime;
      if (therapeuticLineChanged && changesObj.therapeuticLine.currentValue) {
        loadRegimensByTherapeuticLine(changesObj.therapeuticLine.currentValue);
      }
      if (regimeChanged && changesObj.regime.currentValue) {
        vm.$regime = changesObj.regime.currentValue;
      }
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

    function _onArtPlanChange(arvPlan) {
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
      vm.onArtPlanChange({arvPlan, interruptionReason});
    }

    function _onDrugRegimenChange(drugRegimen) {
      const changed = vm.regime ? drugRegimen.uuid !== vm.regime.uuid : true;
      if (changed) {
        vm.isDrugRegimenEditCancel = true;
        vm.isDrugRegimenChanged = true;
        vm.onDrugRegimenChange({drugRegimen});
      } else {
        vm.isDrugRegimenEditCancel = false;
        vm.isDrugRegimenChanged = false;
        vm.changeReason = null;
      }
    }

    function onDrugRegimenChangeReasonChange(changeReason) {
      vm.isDrugRegimenEdit = false;
      vm.onDrugRegimenChange({drugRegimen: vm.regime, changeReason});
    }

    function onArvPlanInterruptedReasonChange(interruptedReason) {
      vm.isArtPlanInterruptedEdit = false;
      vm.isArvPlanEdit = false;
      vm.onArtPlanChange({arvPlan: vm.artPlan, interruptionReason: interruptedReason});
    }
  }

})();
