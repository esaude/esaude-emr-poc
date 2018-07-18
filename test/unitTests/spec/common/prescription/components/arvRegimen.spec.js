describe('arvRegimen', () => {

  let $componentController, prescriptionService, $q, $rootScope;
  const therapeuticLine = {};
  const drugRegimen = {uuid: "f808f602-bc43-4070-9390-c2ec3fd0bee2"};
  const artPlan = {};
  const patient = {};
  const regimen = {};
  const therapeuticLineRegimens = [];

  beforeEach(module('poc.common.prescription'));

  beforeEach(inject((_$componentController_, _prescriptionService_, _$q_, _$rootScope_) => {
    $componentController = _$componentController_;
    prescriptionService = _prescriptionService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('$onChanges', () => {

    beforeEach(() => {
      spyOn(prescriptionService, 'getRegimensByTherapeuticLine').and.returnValue($q.resolve(therapeuticLineRegimens));
    });

    const onDrugRegimenChange = jasmine.createSpy('onDrugRegimenChange');

    it('should copy the given regimen', () => {

      const regimen = {therapeuticLine, drugRegimen, artPlan};

      const ctrl = $componentController('arvRegimen', null, {patient, onDrugRegimenChange});

      ctrl.$onChanges({regimen: {currentValue: regimen}});

      $rootScope.$apply();

      expect(ctrl.$regimen).toEqual(regimen);

    });

    it('should load regimen for patient current therapeutic line', () => {

      const regimen = {therapeuticLine, drugRegimen, artPlan};

      const ctrl = $componentController('arvRegimen', null, {patient, regimen, onDrugRegimenChange});

      ctrl.$onChanges({regimen: {currentValue: regimen}});

      $rootScope.$apply();

      expect(ctrl.therapeuticLineRegimens).toBe(therapeuticLineRegimens);

    });

  });

  describe('_onTherapeuticLineChange', () => {

    const onTherapeuticLineChange = jasmine.createSpy('onDrugRegimenChange');

    beforeEach(() => {
      spyOn(prescriptionService, 'getRegimensByTherapeuticLine').and.returnValue($q.resolve({}));
    });

    it('should load drug regimens for therapeutic line', () => {

      const ctrl = $componentController('arvRegimen', null, {patient, onTherapeuticLineChange});

      ctrl._onTherapeuticLineChange(therapeuticLine);

      expect(prescriptionService.getRegimensByTherapeuticLine).toHaveBeenCalledWith(patient, therapeuticLine);

    });

    it('should remove drug regimen from prescription', () => {

      const ctrl = $componentController('arvRegimen', null, {patient, regimen, onTherapeuticLineChange});

      ctrl.$regimen.drugRegimen = {uuid: "f808f602-bc43-4070-9390-c2ec3fd0bee2", display: "TDF+3TC+LPV/r"};

      ctrl._onTherapeuticLineChange(therapeuticLine);

      $rootScope.$apply();

      expect(ctrl.$regimen.drugRegimen).toBeNull();

    });

    it('should disable therapeutic line edit mode', () => {

      const ctrl = $componentController('arvRegimen', null, {patient, regimen, onTherapeuticLineChange});

      ctrl.isTheraupeuticLineEdit = true;

      ctrl._onTherapeuticLineChange(therapeuticLine);

      $rootScope.$apply();

      expect(ctrl.isTheraupeuticLineEdit).toBe(false);

    });

    it('should enable drug regimen edit mode', () => {

      const ctrl = $componentController('arvRegimen', null, {patient, regimen, onTherapeuticLineChange});

      ctrl.isRegimenEdit = false;

      ctrl._onTherapeuticLineChange(therapeuticLine);

      $rootScope.$apply();

      expect(ctrl.isDrugRegimenEdit).toBe(true);

    });

    it('should disable drug regimen cancel edit mode', () => {

      const ctrl = $componentController('arvRegimen', null, {patient, regimen, onTherapeuticLineChange});

      ctrl.isRegimenEditCancel = true;

      ctrl._onTherapeuticLineChange(therapeuticLine);

      $rootScope.$apply();

      expect(ctrl.isDrugRegimenEditCancel).toBe(false);

    });

    it('should call onTherapeuticLineChange binding', () => {

      const ctrl = $componentController('arvRegimen', null, {patient, regimen, onTherapeuticLineChange});

      ctrl.isRegimenEditCancel = true;

      ctrl._onTherapeuticLineChange(therapeuticLine);

      $rootScope.$apply();

      expect(onTherapeuticLineChange).toHaveBeenCalledWith({therapeuticLine});

    });

  });

  describe('_onDrugRegimenChange', () => {

    describe('regimen did change', () => {

      it('should disable drug regimen cancel edit mode', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regimen});

        ctrl.isRegimenEditCancel = false;
        ctrl.regimen.drugRegimen = {uuid: "daf60844-9002-403f-bd93-3838149a9a5e"};

        ctrl._onDrugRegimenChange({uuid: "f808f602-bc43-4070-9390-c2ec3fd0bee2"});

        $rootScope.$apply();

        expect(ctrl.isDrugRegimenEditCancel).toBe(true);

      });

      it('should say that flag prescription for regimen change', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regimen});

        ctrl.regimen.drugRegimen = {uuid: "daf60844-9002-403f-bd93-3838149a9a5e"};

        ctrl._onDrugRegimenChange({uuid: "f808f602-bc43-4070-9390-c2ec3fd0bee2"});

        $rootScope.$apply();

        expect(ctrl.$regimen.isDrugRegimenChanged).toBe(true);

      });

    });

    describe('regimen did not change', () => {

      it('should enable drug regimen cancel edit mode', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regimen});

        const drugRegimen = {uuid: "daf60844-9002-403f-bd93-3838149a9a5e"};
        ctrl.isRegimenEditCancel = true;
        ctrl.regimen.drugRegimen = drugRegimen;

        ctrl._onDrugRegimenChange(drugRegimen);

        $rootScope.$apply();

        expect(ctrl.isDrugRegimenEditCancel).toBe(false);

      });

      it('should remove mark that drug regimen changed', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regimen});

        const drugRegimen = {uuid: "daf60844-9002-403f-bd93-3838149a9a5e"};
        ctrl.regimen.drugRegimen = drugRegimen;
        ctrl.$regimen.isDrugRegimenChanged = true;

        ctrl._onDrugRegimenChange(drugRegimen);

        $rootScope.$apply();

        expect(ctrl.$regimen.isDrugRegimenChanged).toBe(false);

      });

      it('should remove drug regimen change reason from prescription', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regimen});

        const drugRegimen = {uuid: "daf60844-9002-403f-bd93-3838149a9a5e"};
        ctrl.regimen.drugRegimen = drugRegimen;
        ctrl.$regimen.changeReason = 'Motivos';

        ctrl._onDrugRegimenChange(drugRegimen);

        $rootScope.$apply();

        expect(ctrl.$regimen.changeReason).toBeNull();

      });

    });
  });

  describe('_onArtPlanChange', () => {

    const onArtPlanChange = jasmine.createSpy('onArtPlanChange');

    describe('changed to interrupt', () => {

      beforeEach(() => {
        spyOn(prescriptionService, 'isArtPlanInterrupt').and.returnValue(true);
      });

      it('should mark that art plan is interrupted', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regimen, onArtPlanChange});

        const artPlan = {uuid: "e1d9ef28-1d5f-11e0-b929-000c29ad1d07", display: "INICIAR"};

        ctrl.$regimen.isPlanInterrupted = false;

        ctrl._onArtPlanChange(artPlan);

        expect(ctrl.$regimen.isPlanInterrupted).toBe(true);

      });

      it('should enable art plan interrupt edit mode', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regimen, onArtPlanChange});

        const artPlan = {uuid: "e1d9ef28-1d5f-11e0-b929-000c29ad1d07", display: "INICIAR"};

        ctrl.isArtPlanInterruptedEdit = false;

        ctrl._onArtPlanChange(artPlan);

        expect(ctrl.isArtPlanInterruptedEdit).toBe(true);

      });

    });

    describe('not changed to interrupt', () => {

      beforeEach(() => {
        spyOn(prescriptionService, 'isArtPlanInterrupt').and.returnValue(false);
      });

      it('should disable art plan edit mode', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regimen, onArtPlanChange});

        const artPlan = {uuid: "e1d9ef28-1d5f-11e0-b929-000c29ad1d07", display: "INICIAR"};

        ctrl.isArtPlanInterruptedEdit = true;
        ctrl._onArtPlanChange(artPlan);

        expect(ctrl.isArtPlanInterruptedEdit).toBe(false);

      });

      it('should remove mark that art plan is interrupted', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regimen, onArtPlanChange});

        const artPlan = {uuid: "e1d9ef28-1d5f-11e0-b929-000c29ad1d07", display: "INICIAR"};

        ctrl.$regimen.isPlanInterrupted = true;

        ctrl._onArtPlanChange(artPlan);

        expect(ctrl.$regimen.isPlanInterrupted).toBe(false);

      });

      it('should disable art plan interrupt edit mode', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regimen, onArtPlanChange});

        const artPlan = {uuid: "e1d9ef28-1d5f-11e0-b929-000c29ad1d07", display: "INICIAR"};

        ctrl.isArtPlanInterruptedEdit = true;

        ctrl._onArtPlanChange(artPlan);

        expect(ctrl.isArtPlanInterruptedEdit).toBe(false);

      });

      it('should remove art plan interrupt reason', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regimen, onArtPlanChange});

        const artPlan = {uuid: "e1d9ef28-1d5f-11e0-b929-000c29ad1d07", display: "INICIAR"};

        ctrl.$regimen.interruptedReason = {};

        ctrl._onArtPlanChange(artPlan);

        expect(ctrl.$regimen.interruptedReason).toBeNull();

      });

    });

    describe('onDrugRegimenChangeReasonChange', () => {

      const onDrugRegimenChange = jasmine.createSpy('onDrugRegimenChange');

      it('should call onDrugRegimenChange binding', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regimen, onDrugRegimenChange});

        const changeReason = {uuid: "e1de8560-1d5f-11e0-b929-000c29ad1d07", display: "LACK OF INITIAL EFFECTIVENESS"};
        ctrl.$regimen.drugRegimen = regimen.drugRegimen;
        ctrl.onDrugRegimenChangeReasonChange(changeReason);

        $rootScope.$apply();

        expect(onDrugRegimenChange).toHaveBeenCalledWith(jasmine.objectContaining({drugRegimen: regimen.drugRegimen}));

      });

    });

  });

});
