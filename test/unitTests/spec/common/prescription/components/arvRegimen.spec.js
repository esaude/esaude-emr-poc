describe('arvRegimen', () => {

  let $componentController, prescriptionService, $q, $rootScope;
  const therapeuticLine = {};
  const regime = {uuid: "f808f602-bc43-4070-9390-c2ec3fd0bee2"};
  const patient = {};
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

    it('should copy the given regime', () => {

      const ctrl = $componentController('arvRegimen', null, {patient, onDrugRegimenChange});

      ctrl.$onChanges({regime: {currentValue: regime}, therapeuticLine: {currentValue: therapeuticLine}});

      $rootScope.$apply();

      expect(ctrl.$regime).toEqual(regime);

    });

    it('should load regimen for patient current therapeutic line', () => {

      const ctrl = $componentController('arvRegimen', null, {patient, regime, onDrugRegimenChange});

      ctrl.$onChanges({regime: {currentValue: regime}, therapeuticLine: {currentValue: therapeuticLine}});

      $rootScope.$apply();

      expect(ctrl.therapeuticLineRegimens).toBe(therapeuticLineRegimens);

    });

  });

  describe('_onTherapeuticLineChange', () => {

    const onTherapeuticLineChange = jasmine.createSpy('onTherapeuticLineChange');

    beforeEach(() => {
      spyOn(prescriptionService, 'getRegimensByTherapeuticLine').and.returnValue($q.resolve([]));
    });

    it('should load drug regimens for therapeutic line', () => {

      const ctrl = $componentController('arvRegimen', null, {patient, onTherapeuticLineChange});

      ctrl._onTherapeuticLineChange(therapeuticLine);

      expect(prescriptionService.getRegimensByTherapeuticLine).toHaveBeenCalledWith(patient, therapeuticLine);

    });

    it('should remove regimen', () => {

      const ctrl = $componentController('arvRegimen', null, {patient, onTherapeuticLineChange});

      ctrl.regimen = {uuid: "f808f602-bc43-4070-9390-c2ec3fd0bee2", display: "TDF+3TC+LPV/r"};

      ctrl._onTherapeuticLineChange(therapeuticLine);

      $rootScope.$apply();

      expect(ctrl.regime).toBeNull();

    });

    it('should disable therapeutic line edit mode', () => {

      const ctrl = $componentController('arvRegimen', null, {patient, regime, onTherapeuticLineChange});

      ctrl.isTheraupeuticLineEdit = true;

      ctrl._onTherapeuticLineChange(therapeuticLine);

      $rootScope.$apply();

      expect(ctrl.isTheraupeuticLineEdit).toBe(false);

    });

    it('should enable drug regimen edit mode', () => {

      const ctrl = $componentController('arvRegimen', null, {patient, regime, onTherapeuticLineChange});

      ctrl.isRegimenEdit = false;

      ctrl._onTherapeuticLineChange(therapeuticLine);

      $rootScope.$apply();

      expect(ctrl.isDrugRegimenEdit).toBe(true);

    });

    it('should disable drug regimen cancel edit mode', () => {

      const ctrl = $componentController('arvRegimen', null, {patient, regime, onTherapeuticLineChange});

      ctrl.isRegimenEditCancel = true;

      ctrl._onTherapeuticLineChange(therapeuticLine);

      $rootScope.$apply();

      expect(ctrl.isDrugRegimenEditCancel).toBe(false);

    });

    it('should call onTherapeuticLineChange binding', () => {

      const ctrl = $componentController('arvRegimen', null, {patient, regime, onTherapeuticLineChange});

      ctrl.isRegimenEditCancel = true;

      ctrl._onTherapeuticLineChange(therapeuticLine);

      $rootScope.$apply();

      expect(onTherapeuticLineChange).toHaveBeenCalledWith({therapeuticLine});

    });

  });

  describe('_onDrugRegimenChange', () => {

    const onDrugRegimenChange = jasmine.createSpy('onDrugRegimenChange');

    describe('regimen did change', () => {

      it('should disable drug regimen cancel edit mode', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onDrugRegimenChange});

        ctrl.isRegimenEditCancel = false;
        ctrl.regime = {uuid: "daf60844-9002-403f-bd93-3838149a9a5e"};

        ctrl._onDrugRegimenChange({uuid: "f808f602-bc43-4070-9390-c2ec3fd0bee2"});

        $rootScope.$apply();

        expect(ctrl.isDrugRegimenEditCancel).toBe(true);

      });

      it('should say that flag prescription for regimen change', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, drugRegimen: regime, onDrugRegimenChange});

        ctrl.regime = {uuid: "daf60844-9002-403f-bd93-3838149a9a5e"};

        ctrl._onDrugRegimenChange({uuid: "f808f602-bc43-4070-9390-c2ec3fd0bee2"});

        $rootScope.$apply();

        expect(ctrl.isDrugRegimenChanged).toBe(true);

      });

      it('should call onDrugRegimenChange binding', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onDrugRegimenChange});

        ctrl.isRegimenEditCancel = true;

        const drugRegimen = {uuid: "f808f602-bc43-4070-9390-c2ec3fd0bff3"};
        ctrl._onDrugRegimenChange(drugRegimen);

        $rootScope.$apply();

        expect(onDrugRegimenChange).toHaveBeenCalledWith({drugRegimen});

      });

    });

    describe('regimen did not change', () => {

      it('should enable drug regimen cancel edit mode', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime});

        ctrl.isRegimenEditCancel = true;
        ctrl.regime = regime;

        ctrl._onDrugRegimenChange(regime);

        $rootScope.$apply();

        expect(ctrl.isDrugRegimenEditCancel).toBe(false);

      });

      it('should remove mark that drug regimen changed', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime});

        const drugRegimen = {uuid: "daf60844-9002-403f-bd93-3838149a9a5e"};
        ctrl.regime = drugRegimen;
        ctrl.isDrugRegimenChanged = true;

        ctrl._onDrugRegimenChange(drugRegimen);

        $rootScope.$apply();

        expect(ctrl.isDrugRegimenChanged).toBe(false);

      });

      it('should remove drug regimen change reason from prescription', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime});

        const drugRegimen = {uuid: "daf60844-9002-403f-bd93-3838149a9a5e"};
        ctrl.regime = drugRegimen;
        ctrl.changeReason = 'Motivos';

        ctrl._onDrugRegimenChange(drugRegimen);

        $rootScope.$apply();

        expect(ctrl.changeReason).toBeNull();

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

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onArtPlanChange});

        const artPlan = {uuid: "e1d9ef28-1d5f-11e0-b929-000c29ad1d07", display: "INICIAR"};

        ctrl.isPlanInterrupted = false;

        ctrl._onArtPlanChange(artPlan);

        expect(ctrl.isPlanInterrupted).toBe(true);

      });

      it('should enable art plan interrupt edit mode', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onArtPlanChange});

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

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onArtPlanChange});

        const artPlan = {uuid: "e1d9ef28-1d5f-11e0-b929-000c29ad1d07", display: "INICIAR"};

        ctrl.isArtPlanInterruptedEdit = true;
        ctrl._onArtPlanChange(artPlan);

        expect(ctrl.isArtPlanInterruptedEdit).toBe(false);

      });

      it('should remove mark that art plan is interrupted', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onArtPlanChange});

        const artPlan = {uuid: "e1d9ef28-1d5f-11e0-b929-000c29ad1d07", display: "INICIAR"};

        ctrl.isPlanInterrupted = true;

        ctrl._onArtPlanChange(artPlan);

        expect(ctrl.isPlanInterrupted).toBe(false);

      });

      it('should disable art plan interrupt edit mode', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onArtPlanChange});

        const artPlan = {uuid: "e1d9ef28-1d5f-11e0-b929-000c29ad1d07", display: "INICIAR"};

        ctrl.isArtPlanInterruptedEdit = true;

        ctrl._onArtPlanChange(artPlan);

        expect(ctrl.isArtPlanInterruptedEdit).toBe(false);

      });

      it('should remove art plan interrupt reason', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onArtPlanChange});

        const artPlan = {uuid: "e1d9ef28-1d5f-11e0-b929-000c29ad1d07", display: "INICIAR"};

        ctrl.interruptedReason = {};

        ctrl._onArtPlanChange(artPlan);

        expect(ctrl.interruptedReason).toBeNull();

      });

    });

    describe('onDrugRegimenChangeReasonChange', () => {

      const onDrugRegimenChange = jasmine.createSpy('onDrugRegimenChange');

      it('should call onDrugRegimenChange binding', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onDrugRegimenChange});

        const changeReason = {uuid: "e1de8560-1d5f-11e0-b929-000c29ad1d07", display: "LACK OF INITIAL EFFECTIVENESS"};
        ctrl.regime = regime.drugRegimen;
        ctrl.onDrugRegimenChangeReasonChange(changeReason);

        $rootScope.$apply();

        expect(onDrugRegimenChange).toHaveBeenCalledWith(jasmine.objectContaining({drugRegimen: regime.drugRegimen}));

      });

    });

    describe('onArvPlanInterruptedReasonChange', () => {

      const onArtPlanChange = jasmine.createSpy('onArtPlanChange');

      it('should call onArtPlanChange binding', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onArtPlanChange});

        const interruptedReason = {uuid: "e1de8560-1d5f-11e0-b929-000c29ad1d07", display: "LACK OF INITIAL EFFECTIVENESS"};

        ctrl.onArvPlanInterruptedReasonChange(interruptedReason);

        $rootScope.$apply();

        expect(onArtPlanChange).toHaveBeenCalledWith(jasmine.objectContaining({interruptionReason: interruptedReason}));

      });

      it('should disable art plan edit mode', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onArtPlanChange});

        const interruptedReason = {uuid: "e1de8560-1d5f-11e0-b929-000c29ad1d07", display: "LACK OF INITIAL EFFECTIVENESS"};

        ctrl.isArvPlanEdit = true;

        ctrl.onArvPlanInterruptedReasonChange(interruptedReason);

        $rootScope.$apply();

        expect(ctrl.isArvPlanEdit).toEqual(false);

      });

      it('should disable art plan interruped reason edit mode', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onArtPlanChange});

        const interruptedReason = {uuid: "e1de8560-1d5f-11e0-b929-000c29ad1d07", display: "LACK OF INITIAL EFFECTIVENESS"};

        ctrl.isArtPlanInterruptedEdit = true;

        ctrl.onArvPlanInterruptedReasonChange(interruptedReason);

        $rootScope.$apply();

        expect(ctrl.isArtPlanInterruptedEdit).toEqual(false);

      });

    });

  });

});
