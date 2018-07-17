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
  function PocWizardStep() {

    var vm = this;
    vm.current = false;
    vm.visited = false;
    vm.$onInit = $onInit;
    vm.getClass = getClass;

    function $onInit() {
      validateMandatoryAttributes();
      vm.pocWizard.addStep(vm);
    }

    function validateMandatoryAttributes() {
      if (angular.isUndefined(vm.form)) {
        throw "[pocWizardStep] form attribute is mandatory";
      }
    }

    function getClass() {
      var clazz = "";
      if (vm.current) {
        clazz = "poc-wizard-step-current";
      } else if (!vm.form.$valid && vm.visited) {
        clazz = "poc-wizard-step-inconsistent";
      }
      return clazz;
    }
  }

})();
