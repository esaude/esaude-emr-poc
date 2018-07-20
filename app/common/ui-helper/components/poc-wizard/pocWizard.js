(function () {
  'use strict';

  angular
    .module('bahmni.common.uiHelper')
    .component('pocWizard', {
      bindings: {
        onSave: '&',
        onShowMessage: '&'
      },
      controller: PocWizardController,
      controllerAs: 'vm',
      templateUrl: '../common/ui-helper/components/poc-wizard/pocWizard.html',
      transclude: true
    });

  /* @ngInject */
  function PocWizardController($log) {

    var TRYING_TO_STEP_FORWARD_ON_LAST_STEP = "Trying to step forward on last step";
    var TRYING_TO_STEP_BACK_ON_FIRST_STEP = "Trying to step back on first step";
    var TRYING_TO_GO_TO_INVALID_STEP_WHEN_ALL_STEPS_ARE_VALID = "Trying to go to invalid step when all steps are valid";

    var vm = this;
    vm.stepControllers = [];

    vm.$onInit = $onInit;
    vm.addStep = addStep;
    vm.setCurrentStep = setCurrentStep;
    vm.getCurrentStep = getCurrentStep;
    vm.stepBackwards = stepBackwards;
    vm.stepForward = stepForward;
    vm.isFirstStep = isFirstStep;
    vm.isLastStep = isLastStep;
    vm.allStepsAreValid = allStepsAreValid;
    vm.goToFirstInvalidStep = goToFirstInvalidStep;
    vm.save = save;

    function $onInit() {
    }

    function addStep(stepController) {
      vm.stepControllers.push(stepController);
      if (!getCurrentStep()) {
        setCurrentStep(stepController);
      }
    }

    function setCurrentStep(stepController) {
      notifyShowMessageStatusChange(stepController.visited);
      clearCurrentStep();
      stepController.current = true;
      setPreviousStepsAsVisited(stepController);
    }

    function setPreviousStepsAsVisited(stepController) {
      var indexOfCurrentStep = vm.stepControllers.indexOf(stepController);
      for (var i = 0; i <= indexOfCurrentStep; i++) {
        vm.stepControllers[i].visited = true;
      }
    }

    function clearCurrentStep() {
      vm.stepControllers.forEach(step => { step.current = false; });
    }

    function getCurrentStep() {
      return vm.stepControllers.find(step => step.current);
    }

    function stepBackwards() {
      if (!isFirstStep()) {
        var indexOfCurrentStep = vm.stepControllers.indexOf(vm.getCurrentStep());
        setCurrentStep(vm.stepControllers[indexOfCurrentStep - 1]);
      } else {
        throw TRYING_TO_STEP_BACK_ON_FIRST_STEP;
      }
    }

    function stepForward() {
      if (!isLastStep()) {
        //We only step forward if the current form is valid, else we stay put so the user can see the validation error on the screen
        if (vm.getCurrentStep().isFormValid()) {
          var indexOfCurrentStep = vm.stepControllers.indexOf(vm.getCurrentStep());
          setCurrentStep(vm.stepControllers[indexOfCurrentStep + 1]);
        } else {
          $log.info("[pocWizard] I'm not steping forward because the form of current step is invalid. Make sure we show a validation error to the user.");
          notifyShowMessageStatusChange(true);
        }
      } else {
        throw TRYING_TO_STEP_FORWARD_ON_LAST_STEP;
      }
    }

    function notifyShowMessageStatusChange(showMessage) {
      vm.onShowMessage({ showMessage: showMessage });
    }

    function isFirstStep() {
      return vm.stepControllers.indexOf(vm.getCurrentStep()) === 0;
    }

    function isLastStep() {
      return vm.stepControllers.indexOf(vm.getCurrentStep()) === vm.stepControllers.length - 1;
    }

    function allStepsAreValid() {
      return angular.isUndefined(vm.stepControllers.find(step => !step.isFormValid()));
    }

    function goToFirstInvalidStep() {
      var invalidStep = vm.stepControllers.find(step => !step.isFormValid());
      if (angular.isDefined(invalidStep)) {
        setCurrentStep(invalidStep);
      } else {
        throw TRYING_TO_GO_TO_INVALID_STEP_WHEN_ALL_STEPS_ARE_VALID;
      }
    }

    function save() {
      vm.onSave();
    }

  }

})();
