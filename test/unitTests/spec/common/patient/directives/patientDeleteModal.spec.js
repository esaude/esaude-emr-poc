describe('patientDeleteModalController', () => {

  var $componentController, $q, $state, $rootScope, conceptService, encounterService;

  beforeEach(module('common.patient'));
  beforeEach(inject((_$componentController_, _$q_, _$state_, _$rootScope_, _conceptService_, _encounterService_) => {
    $componentController = _$componentController_;
    $q = _$q_;
    $state = _$state_;
    $rootScope = _$rootScope_;
    conceptService = _conceptService_;
    encounterService = _encounterService_;
  }));

  describe('$onInit', () => {

    beforeEach(() => {

      spyOn(conceptService, 'getDeathConcepts').and.callFake(() => $q(resolve => resolve({})));

      spyOn(encounterService, 'getEncountersOfPatient').and.callFake(() => $q(resolve => resolve({data: {results: [1]}})));

    });

    it('should load death reason concepts', () => {

      var ctrl = $componentController('patientDeleteModal', null, {resolve: {patient: {uuid: 'uuid'}}});

      ctrl.$onInit();

      expect(conceptService.getDeathConcepts).toHaveBeenCalled();

    });

    it('should load patient consultations', () => {

      var ctrl = $componentController('patientDeleteModal', null, {resolve: {patient: {uuid: 'uuid'}}});

      ctrl.$onInit();

      expect(encounterService.getEncountersOfPatient).toHaveBeenCalled();

    });

    describe('patient with consultations', () => {

      it('should set has consultations flag', () => {

        var ctrl = $componentController('patientDeleteModal', null, {resolve: {patient: {uuid: 'uuid'}}});

        ctrl.$onInit();

        $rootScope.$apply();

        expect(ctrl.hasConsultations).toEqual(true);

      });

      it('should set dead flag', () => {

        var ctrl = $componentController('patientDeleteModal', null, {resolve: {patient: {uuid: 'uuid'}}});

        ctrl.$onInit();

        $rootScope.$apply();

        expect(ctrl.data.dead).toEqual(true);

      });

    });

  });

  describe('ok', () => {

    it('should call close binding', () => {

      var close = jasmine.createSpy('close');
      var ctrl = $componentController('patientDeleteModal', null, {close: close});

      ctrl.ok();

      expect(close).toHaveBeenCalled();

    });

  });

  describe('cancel', () => {

    it('should call dismiss binding', () => {

      var dismiss = jasmine.createSpy('dismiss');
      var ctrl = $componentController('patientDeleteModal', null, {close: dismiss});

      ctrl.ok();

      expect(dismiss).toHaveBeenCalled();

    });

  });

});
