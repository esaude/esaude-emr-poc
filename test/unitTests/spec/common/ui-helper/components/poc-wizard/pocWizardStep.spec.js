describe('pocWizardStep', () => {

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

  describe('$onInit', () => {

    it('registers itself as a step of parent controller', () => {
      var pocWizard = $componentController('pocWizard', null, { onShowMessage: () => { } });
      var pocWizardStep = $componentController('pocWizardStep', null, { pocWizard: pocWizard });
      pocWizardStep.$onInit();
      expect(pocWizard.stepControllers.length).toBe(1);
      expect(pocWizard.getCurrentStep()).toBe(pocWizardStep);
    });

  });

  describe('isFormValid', () => {

    it('returns true if no form is used', () => {
      var pocWizard = $componentController('pocWizard', null, { onShowMessage: () => { } });
      var pocWizardStep = $componentController('pocWizardStep', null, { pocWizard: pocWizard });
      pocWizardStep.$onInit();
      expect(pocWizardStep.isFormValid()).toBe(true);
    });

    it('returns form validity if the form is used', () => {
      var pocWizard = $componentController('pocWizard', null, { onShowMessage: () => { } });
      var pocWizardStep = $componentController('pocWizardStep', null, { pocWizard: pocWizard, form: { $valid: false } });
      pocWizardStep.$onInit();
      expect(pocWizardStep.isFormValid()).toBe(false);
    });
  });

  describe('getClass', () => {

    it('should report as current step', () => {
      var pocWizard = $componentController('pocWizard', null, { onShowMessage: () => { } });
      var step1 = $componentController('pocWizardStep', null, { pocWizard: pocWizard, title: "step1" });
      var step2 = $componentController('pocWizardStep', null, { pocWizard: pocWizard, title: "step2" });
      step1.$onInit();
      step2.$onInit();
      expect(step1.getClass()).toBe("poc-wizard-step-current");
    });

    it('should report as normal step', () => {
      var pocWizard = $componentController('pocWizard', null, { onShowMessage: () => { } });
      var step1 = $componentController('pocWizardStep', null, { pocWizard: pocWizard, title: "step1" });
      var step2 = $componentController('pocWizardStep', null, { pocWizard: pocWizard, title: "step2" });
      step1.$onInit();
      step2.$onInit();
      expect(step2.getClass()).toBe("");
    });

    it('should report as normal step if form invalid but step not visited yet', () => {
      var pocWizard = $componentController('pocWizard', null, { onShowMessage: () => { } });
      var step1 = $componentController('pocWizardStep', null, { pocWizard: pocWizard, title: "step1" });
      var step2 = $componentController('pocWizardStep', null, { pocWizard: pocWizard, title: "step2", form: { $valid: false } });
      var step3 = $componentController('pocWizardStep', null, { pocWizard: pocWizard, title: "step3" });
      step1.$onInit();
      step2.$onInit();
      step3.$onInit();
      expect(step2.getClass()).toBe("");
    });

    it('should report as invalid step', () => {
      var pocWizard = $componentController('pocWizard', null, { onShowMessage: () => { } });
      var step1 = $componentController('pocWizardStep', null, { pocWizard: pocWizard, title: "step1" });
      var step2 = $componentController('pocWizardStep', null, { pocWizard: pocWizard, title: "step2", form: { $valid: false } });
      var step3 = $componentController('pocWizardStep', null, { pocWizard: pocWizard, title: "step3" });
      step1.$onInit();
      step2.$onInit();
      step3.$onInit();
      pocWizard.setCurrentStep(step3);
      expect(step2.getClass()).toBe("poc-wizard-step-inconsistent");
    });
  });
});
