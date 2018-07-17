describe('pocWizard', () => {

  var $componentController, patientService, $q;

  beforeEach(module('common.patient', ($provide, $translateProvider, $urlRouterProvider) => {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', $q => () => {
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject((_$componentController_) => {
    $componentController = _$componentController_;
  }));

  describe('addStep', () => {

    it('infact adds the step', () => {
      var ctrl = $componentController('pocWizard', null, { onShowMessage: () => { } });
      expect(ctrl.stepControllers.length).toBe(0);
      ctrl.$onInit();
      ctrl.addStep({ current: false, visited: false });
      expect(ctrl.stepControllers.length).toBe(1);
    });

    it('set the step as current if its the first', () => {
      var ctrl = $componentController('pocWizard', null, { onShowMessage: () => { } });
      ctrl.$onInit();
      ctrl.addStep({ current: false, visited: false });
      expect(ctrl.stepControllers[0].current).toBe(true);
    });

    it('does not set as current when adding the second step', () => {
      var ctrl = $componentController('pocWizard', null, { onShowMessage: () => { } });
      ctrl.$onInit();
      ctrl.addStep({ title: "step1", current: false, visited: false });
      ctrl.addStep({ title: "step2", current: false, visited: false });
      expect(ctrl.getCurrentStep().title).toBe("step1");
    });
  });

  describe('setCurrentStep', () => {

    it('clears the previous current step', () => {
      var ctrl = $componentController('pocWizard', null, { onShowMessage: () => { } });
      ctrl.$onInit();
      ctrl.addStep({ title: "step1", current: false, visited: false });
      ctrl.addStep({ title: "step2", current: false, visited: false });
      expect(ctrl.getCurrentStep().title).toBe("step1");
      ctrl.setCurrentStep(ctrl.stepControllers.find(step => step.title === "step2"));
      expect(ctrl.getCurrentStep().title).toBe("step2");
    });

  });

  describe('stepBackwards', () => {

    it('infact goes back one step', () => {
      var ctrl = $componentController('pocWizard', null, { onShowMessage: () => { } });
      ctrl.$onInit();
      ctrl.addStep({ title: "step1", current: false, visited: false });
      ctrl.addStep({ title: "step2", current: false, visited: false });
      ctrl.setCurrentStep(ctrl.stepControllers.find(step => step.title === "step2"));
      expect(ctrl.getCurrentStep().title).toBe("step2");
      ctrl.stepBackwards();
      expect(ctrl.getCurrentStep().title).toBe("step1");
    });

    it('throws exeption when trying to go back on the first step', () => {
      var ctrl = $componentController('pocWizard', null, { onShowMessage: () => { } });
      ctrl.$onInit();
      ctrl.addStep({ title: "step1", current: false, visited: false });
      ctrl.addStep({ title: "step2", current: false, visited: false });
      expect(ctrl.getCurrentStep().title).toBe("step1");
      expect(ctrl.stepBackwards).toThrow("Trying to step back on first step");
    });

  });

  describe('stepForward', () => {

    it('infact goes forward one step', () => {
      var ctrl = $componentController('pocWizard', null, { onShowMessage: () => { } });
      ctrl.$onInit();
      ctrl.addStep({ title: "step1", current: false, visited: false, isFormValid: () => true });
      ctrl.addStep({ title: "step2", current: false, visited: false });
      expect(ctrl.getCurrentStep().title).toBe("step1");
      ctrl.stepForward();
      expect(ctrl.getCurrentStep().title).toBe("step2");
    });

    it('throws exeption when trying to go forward on the last step', () => {
      var ctrl = $componentController('pocWizard', null, { onShowMessage: () => { } });
      ctrl.$onInit();
      ctrl.addStep({ title: "step1", current: false, visited: false, isFormValid: () => true });
      ctrl.addStep({ title: "step2", current: false, visited: false, isFormValid: () => true });
      expect(ctrl.getCurrentStep().title).toBe("step1");
      ctrl.stepForward();
      expect(ctrl.getCurrentStep().title).toBe("step2");
      expect(ctrl.stepForward).toThrow("Trying to step forward on last step");
    });

    it('does not go forward if form is not valid', () => {
      var ctrl = $componentController('pocWizard', null, { onShowMessage: () => { } });
      ctrl.$onInit();
      ctrl.addStep({ title: "step1", current: false, visited: false, isFormValid: () => false });
      ctrl.addStep({ title: "step2", current: false, visited: false });
      expect(ctrl.getCurrentStep().title).toBe("step1");
      ctrl.stepForward();
      expect(ctrl.getCurrentStep().title).toBe("step1");
    });
  });

  describe('allStepsAreValid', () => {

    it('should report all steps valid', () => {
      var ctrl = $componentController('pocWizard', null, { onShowMessage: () => { } });
      ctrl.$onInit();
      ctrl.addStep({ title: "step1", current: false, visited: false, isFormValid: () => true });
      ctrl.addStep({ title: "step2", current: false, visited: false, isFormValid: () => true });
      expect(ctrl.allStepsAreValid()).toBe(true);
    });

    it('should report not all steps valid', () => {
      var ctrl = $componentController('pocWizard', null, { onShowMessage: () => { } });
      ctrl.$onInit();
      ctrl.addStep({ title: "step1", current: false, visited: false, isFormValid: () => true });
      ctrl.addStep({ title: "step2", current: false, visited: false, isFormValid: () => false });
      expect(ctrl.allStepsAreValid()).toBe(false);
    });
  });

  describe('goToFirstInvalidStep', () => {

    it('works for single step', () => {
      var ctrl = $componentController('pocWizard', null, { onShowMessage: () => { } });
      ctrl.$onInit();
      ctrl.addStep({ title: "step1", current: false, visited: false, isFormValid: () => false });
      ctrl.goToFirstInvalidStep();
      expect(ctrl.getCurrentStep().title).toBe("step1");
    });

    it('works for multiple steps', () => {
      var ctrl = $componentController('pocWizard', null, { onShowMessage: () => { } });
      ctrl.$onInit();
      ctrl.addStep({ title: "step1", current: false, visited: false, isFormValid: () => true });
      ctrl.addStep({ title: "step2", current: false, visited: false, isFormValid: () => false });
      ctrl.addStep({ title: "step3", current: false, visited: false, isFormValid: () => true });
      ctrl.goToFirstInvalidStep();
      expect(ctrl.getCurrentStep().title).toBe("step2");
    });

    it('should throw an exception if no step is invalid', () => {
      var ctrl = $componentController('pocWizard', null, { onShowMessage: () => { } });
      ctrl.$onInit();
      ctrl.addStep({ title: "step1", current: false, visited: false, isFormValid: () => true });
      ctrl.addStep({ title: "step2", current: false, visited: false, isFormValid: () => true });
      ctrl.addStep({ title: "step3", current: false, visited: false, isFormValid: () => true });
      expect(ctrl.goToFirstInvalidStep).toThrow("Trying to go to invalid step when all steps are valid");
    });
  });
});
