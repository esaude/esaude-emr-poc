(() => {
  'use strict';

  angular
    .module('poc.common.prescription')
    .component('arvRegimen', {
      bindings: {
        patient: '<',
        regimen: '<',
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

    vm.$regimen = {};

    vm.$onChanges = $onChanges;
    vm._onTherapeuticLineChange = _onTherapeuticLineChange;
    vm._onArtPlanChange = _onArtPlanChange;
    vm._onDrugRegimenChange = _onDrugRegimenChange;
    vm.onDrugRegimenChangeReasonChange = onDrugRegimenChangeReasonChange;

    function $onChanges(changesObj) {
      const regimen = changesObj.regimen.currentValue;
      if (regimen.therapeuticLine) {
        vm.$regimen = angular.copy(regimen);
        loadRegimensByTherapeuticLine(regimen.therapeuticLine);
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
          vm.$regimen.drugRegimen = null;
          vm.isTheraupeuticLineEdit = false;
          vm.isDrugRegimenEdit = true;
          vm.isDrugRegimenEditCancel = false;
        })
        .catch(() => {
          notifier.error(translateFilter('COMMON_ERROR'));
        });
      vm.onTherapeuticLineChange({therapeuticLine});
    }

    function _onArtPlanChange(artPlan) {
      if (prescriptionService.isArtPlanInterrupt({artPlan})) {
        vm.$regimen.isPlanInterrupted = true;
        vm.isArtPlanInterruptedEdit = true;
      } else {
        vm.isArvPlanEdit = false;
        vm.$regimen.isPlanInterrupted = false;
        vm.isArtPlanInterruptedEdit = false;
        vm.$regimen.interruptedReason = null;
      }
      vm.onArtPlanChange(artPlan);
    }

    function _onDrugRegimenChange(drugRegimen) {
      const changed = drugRegimen.uuid !== vm.regimen.drugRegimen.uuid;
      if (changed) {
        vm.isDrugRegimenEditCancel = true;
        vm.$regimen.isDrugRegimenChanged = true;
        vm.onDrugRegimenChange({drugRegimen});
      } else {
        vm.isDrugRegimenEditCancel = false;
        vm.$regimen.isDrugRegimenChanged = false;
        vm.$regimen.changeReason = null;
      }
    }

    function onDrugRegimenChangeReasonChange(changeReason) {
      vm.isDrugRegimenEdit = false;
      vm.onDrugRegimenChange({drugRegimen: vm.$regimen.drugRegimen, changeReason});
    }
  }

})();
