describe('arvRegimen', () => {

  let $componentController, prescriptionService, $q, $rootScope;
  const therapeuticLine = {uuid: "a6bbe1ac-5243-40e4-98cb-7d4a1467dfbe", display: "PRIMEIRA LINHA"};
  const regime = {uuid: "9dc17c1b-7b6d-488e-a38d-505a7b65ec82", display: "TDF+3TC+EFV"};
  const arvPlan = {uuid: "e1d9ef28-1d5f-11e0-b929-000c29ad1d07", display: "INICIAR"};
  const patient = {};
  const therapeuticLineRegimens = [];
  const onRegimeChange = jasmine.createSpy('onRegimeChange');
  const onTherapeuticLineChange = jasmine.createSpy('onTherapeuticLineChange');
  const onArvPlanChange = jasmine.createSpy('onArvPlanChange');

  beforeEach(module('poc.common.prescription'));

  beforeEach(inject((_$componentController_, _prescriptionService_, _$q_, _$rootScope_) => {
    $componentController = _$componentController_;
    prescriptionService = _prescriptionService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('$onInit', () => {

    beforeEach(() => {
      spyOn(prescriptionService, 'getPatientRegimen').and.returnValue($q.resolve({therapeuticLine, regime, arvPlan}));
      spyOn(prescriptionService, 'getRegimensByTherapeuticLine').and.returnValue($q.resolve(therapeuticLineRegimens));
    });

    it('should load the patient regimen data', () => {

      const ctrl = $componentController('arvRegimen', null, {patient, onRegimeChange, onTherapeuticLineChange, onArvPlanChange});

      ctrl.$onInit();

      $rootScope.$apply();

      expect(prescriptionService.getPatientRegimen).toHaveBeenCalled();
      expect(ctrl.regime).toEqual(regime);
      expect(ctrl.therapeuticLine).toEqual(therapeuticLine);
      expect(ctrl.arvPlan).toEqual(arvPlan);
    });

    it('should load regimen for patient current therapeutic line', () => {

      const ctrl = $componentController('arvRegimen', null, {patient, therapeuticLine, regime, onRegimeChange, onTherapeuticLineChange, onArvPlanChange});

      ctrl.$onInit();

      $rootScope.$apply();

      expect(ctrl.therapeuticLineRegimens).toBe(therapeuticLineRegimens);

    });

    it('should call onTherapeuticLineChange binding', () => {

      const ctrl = $componentController('arvRegimen', null, {patient, onRegimeChange, onTherapeuticLineChange, onArvPlanChange});

      ctrl.$onInit();

      $rootScope.$apply();

      expect(onTherapeuticLineChange).toHaveBeenCalledWith({therapeuticLine});

    });

    it('should call onRegimeChange binding', () => {

      const ctrl = $componentController('arvRegimen', null, {patient, onRegimeChange, onTherapeuticLineChange, onArvPlanChange});

      ctrl.$onInit();

      $rootScope.$apply();

      expect(onRegimeChange).toHaveBeenCalledWith({regime});

    });

    it('should call onArvPlanChange binding', () => {

      const ctrl = $componentController('arvRegimen', null, {patient, onRegimeChange, onTherapeuticLineChange, onArvPlanChange});

      ctrl.$onInit();

      $rootScope.$apply();

      expect(onArvPlanChange).toHaveBeenCalledWith({arvPlan});

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

  describe('_onRegimeChange', () => {

    beforeEach(() => {
      spyOn(prescriptionService, 'getPatientRegimen').and.returnValue($q.resolve({therapeuticLine, regime, arvPlan}));
      spyOn(prescriptionService, 'getRegimensByTherapeuticLine').and.returnValue($q.resolve(therapeuticLineRegimens));
    });

    describe('regimen did change', () => {

      describe('previous regime exists', () => {

        it('should add flag for regimen change', () => {

          const ctrl = $componentController('arvRegimen', null, {patient, regime, onRegimeChange, onTherapeuticLineChange, onArvPlanChange});

          ctrl.$onInit();

          $rootScope.$apply();

          ctrl._onRegimeChange({uuid: "f808f602-bc43-4070-9390-c2ec3fd0bee2"});

          $rootScope.$apply();

          expect(ctrl.isDrugRegimenChanged).toBe(true);

        });

      });

      it('should disable drug regimen cancel edit mode', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onRegimeChange});

        ctrl.isRegimenEditCancel = false;
        ctrl.regime = {uuid: "daf60844-9002-403f-bd93-3838149a9a5e"};

        ctrl._onRegimeChange({uuid: "f808f602-bc43-4070-9390-c2ec3fd0bee2"});

        $rootScope.$apply();

        expect(ctrl.isDrugRegimenEditCancel).toBe(true);

      });

      it('should call onRegimeChange binding', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onRegimeChange});

        ctrl.isRegimenEditCancel = true;

        const r = {uuid: "f808f602-bc43-4070-9390-c2ec3fd0bff3"};
        ctrl._onRegimeChange(r);

        $rootScope.$apply();

        expect(onRegimeChange).toHaveBeenCalledWith({regime: r});

      });

    });

    describe('regimen did not change', () => {

      it('should enable drug regimen cancel edit mode', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onRegimeChange, onTherapeuticLineChange, onArvPlanChange});

        ctrl.$onInit();

        $rootScope.$apply();

        ctrl.isRegimenEditCancel = true;

        ctrl._onRegimeChange(regime);

        $rootScope.$apply();

        expect(ctrl.isDrugRegimenEditCancel).toBe(false);

      });

      it('should remove flag for regimen change', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onRegimeChange, onTherapeuticLineChange, onArvPlanChange});

        ctrl.$onInit();

        $rootScope.$apply();

        ctrl.isDrugRegimenChanged = true;

        ctrl._onRegimeChange(regime);

        $rootScope.$apply();

        expect(ctrl.isDrugRegimenChanged).toBe(false);

      });

      it('should remove drug regimen change reason', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onRegimeChange, onTherapeuticLineChange, onArvPlanChange});

        ctrl.$onInit();

        $rootScope.$apply();

        ctrl.changeReason = 'Motivos';

        ctrl._onRegimeChange(regime);

        $rootScope.$apply();

        expect(ctrl.changeReason).toBeNull();

      });

    });
  });

  describe('_onArvPlanChange', () => {

    const onArvPlanChange = jasmine.createSpy('onArvPlanChange');

    describe('changed to interrupt', () => {

      beforeEach(() => {
        spyOn(prescriptionService, 'isArtPlanInterrupt').and.returnValue(true);
      });

      it('should mark that art plan is interrupted', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onArvPlanChange});

        const artPlan = {uuid: "e1d9ef28-1d5f-11e0-b929-000c29ad1d07", display: "INICIAR"};

        ctrl.isPlanInterrupted = false;

        ctrl._onArvPlanChange(artPlan);

        expect(ctrl.isPlanInterrupted).toBe(true);

      });

      it('should enable art plan interrupt edit mode', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onArvPlanChange});

        const artPlan = {uuid: "e1d9ef28-1d5f-11e0-b929-000c29ad1d07", display: "INICIAR"};

        ctrl.isArtPlanInterruptedEdit = false;

        ctrl._onArvPlanChange(artPlan);

        expect(ctrl.isArtPlanInterruptedEdit).toBe(true);

      });

    });

    describe('not changed to interrupt', () => {

      beforeEach(() => {
        spyOn(prescriptionService, 'isArtPlanInterrupt').and.returnValue(false);
      });

      it('should disable art plan edit mode', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onArvPlanChange});

        const artPlan = {uuid: "e1d9ef28-1d5f-11e0-b929-000c29ad1d07", display: "INICIAR"};

        ctrl.isArtPlanInterruptedEdit = true;
        ctrl._onArvPlanChange(artPlan);

        expect(ctrl.isArtPlanInterruptedEdit).toBe(false);

      });

      it('should remove mark that art plan is interrupted', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onArvPlanChange});

        const artPlan = {uuid: "e1d9ef28-1d5f-11e0-b929-000c29ad1d07", display: "INICIAR"};

        ctrl.isPlanInterrupted = true;

        ctrl._onArvPlanChange(artPlan);

        expect(ctrl.isPlanInterrupted).toBe(false);

      });

      it('should disable art plan interrupt edit mode', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onArvPlanChange});

        const artPlan = {uuid: "e1d9ef28-1d5f-11e0-b929-000c29ad1d07", display: "INICIAR"};

        ctrl.isArtPlanInterruptedEdit = true;

        ctrl._onArvPlanChange(artPlan);

        expect(ctrl.isArtPlanInterruptedEdit).toBe(false);

      });

      it('should remove art plan interrupt reason', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onArvPlanChange});

        const artPlan = {uuid: "e1d9ef28-1d5f-11e0-b929-000c29ad1d07", display: "INICIAR"};

        ctrl.interruptedReason = {};

        ctrl._onArvPlanChange(artPlan);

        expect(ctrl.interruptedReason).toBeNull();

      });

    });

    describe('onRegimeChangeReasonChange', () => {

      const onRegimeChange = jasmine.createSpy('onRegimeChange');

      it('should call onRegimeChange binding', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onRegimeChange});

        const changeReason = {uuid: "e1de8560-1d5f-11e0-b929-000c29ad1d07", display: "LACK OF INITIAL EFFECTIVENESS"};
        ctrl.regime = regime;
        ctrl.onDrugRegimenChangeReasonChange(changeReason);

        $rootScope.$apply();

        expect(onRegimeChange).toHaveBeenCalledWith(jasmine.objectContaining({regime}));

      });

    });

    describe('onArvPlanInterruptedReasonChange', () => {

      const onArvPlanChange = jasmine.createSpy('onArvPlanChange');

      it('should call onArvPlanChange binding', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onArvPlanChange});

        const interruptedReason = {uuid: "e1de8560-1d5f-11e0-b929-000c29ad1d07", display: "LACK OF INITIAL EFFECTIVENESS"};

        ctrl.onArvPlanInterruptedReasonChange(interruptedReason);

        $rootScope.$apply();

        expect(onArvPlanChange).toHaveBeenCalledWith(jasmine.objectContaining({interruptionReason: interruptedReason}));

      });

      it('should disable art plan edit mode', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onArvPlanChange});

        const interruptedReason = {uuid: "e1de8560-1d5f-11e0-b929-000c29ad1d07", display: "LACK OF INITIAL EFFECTIVENESS"};

        ctrl.isArvPlanEdit = true;

        ctrl.onArvPlanInterruptedReasonChange(interruptedReason);

        $rootScope.$apply();

        expect(ctrl.isArvPlanEdit).toEqual(false);

      });

      it('should disable art plan interruped reason edit mode', () => {

        const ctrl = $componentController('arvRegimen', null, {patient, regime, onArvPlanChange});

        const interruptedReason = {uuid: "e1de8560-1d5f-11e0-b929-000c29ad1d07", display: "LACK OF INITIAL EFFECTIVENESS"};

        ctrl.isArtPlanInterruptedEdit = true;

        ctrl.onArvPlanInterruptedReasonChange(interruptedReason);

        $rootScope.$apply();

        expect(ctrl.isArtPlanInterruptedEdit).toEqual(false);

      });

    });

  });

});
