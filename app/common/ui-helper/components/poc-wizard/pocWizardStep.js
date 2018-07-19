(function () {
  'use strict';

  angular
    .module('bahmni.common.uiHelper')
    .component('pocWizardStep', {
      bindings: {
        title: '@',
        form: '<'
      },
      require: {
        pocWizard: '^^pocWizard'
      },
      controller: PocWizardStep,
      controllerAs: 'vm',
      templateUrl: '../common/ui-helper/components/poc-wizard/pocWizardStep.html',
      transclude: true
    });

  /* @ngInject */
  function PocWizardStep($log) {

    var vm = this;
    vm.current = false;
    vm.visited = false;
    vm.$onInit = $onInit;
    vm.getClass = getClass;
    vm.isFormValid = isFormValid;

    function $onInit() {
      warnPossibleMissingAttributes();
      vm.pocWizard.addStep(vm);
    }

    function warnPossibleMissingAttributes() {
      if (angular.isUndefined(vm.form)) {
        $log.warn("[pocWizardStep] no form defined for step " + vm.title);
      }
    }

    function getClass() {
      var clazz = "";
      if (vm.current) {
        clazz = "poc-wizard-step-current";
      } else if (!isFormValid() && vm.visited) {
        clazz = "poc-wizard-step-inconsistent";
      }
      return clazz;
    }

    function isFormValid() {
      var valid = true;
      if (vm.form) {
        valid = vm.form.$valid;
      }
      return valid;
    }
  }

})();
