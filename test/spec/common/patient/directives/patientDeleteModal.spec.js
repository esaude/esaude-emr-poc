describe('patientDeleteModalController', function () {

  var $componentController, $q, $state, $rootScope, conceptService, encounterService;

  beforeEach(module('common.patient'));
  beforeEach(inject(function(_$componentController_, _$q_, _$state_, _$rootScope_, _conceptService_, _encounterService_) {
    $componentController = _$componentController_;
    $q = _$q_;
    $state = _$state_;
    $rootScope = _$rootScope_;
    conceptService = _conceptService_;
    encounterService = _encounterService_;
  }));

  describe('$onInit', function () {

    beforeEach(function () {

      spyOn(conceptService, 'getDeathConcepts').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      spyOn(encounterService, 'getEncountersOfPatient').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({data: {results: [1]}});
        });
      });

    });

    it('should load death reason concepts', function () {

      var ctrl = $componentController('patientDeleteModal', null, {resolve: {patient: {uuid: 'uuid'}}});

      ctrl.$onInit();

      expect(conceptService.getDeathConcepts).toHaveBeenCalled();

    });

    it('should load patient consultations', function () {

      var ctrl = $componentController('patientDeleteModal', null, {resolve: {patient: {uuid: 'uuid'}}});

      ctrl.$onInit();

      expect(encounterService.getEncountersOfPatient).toHaveBeenCalled();

    });

    describe('patient with consultations', function () {

      it('should set has consultations flag', function () {

        var ctrl = $componentController('patientDeleteModal', null, {resolve: {patient: {uuid: 'uuid'}}});

        ctrl.$onInit();

        $rootScope.$apply();

        expect(ctrl.hasConsultations).toEqual(true);

      });

      it('should set dead flag', function () {

        var ctrl = $componentController('patientDeleteModal', null, {resolve: {patient: {uuid: 'uuid'}}});

        ctrl.$onInit();

        $rootScope.$apply();

        expect(ctrl.data.dead).toEqual(true);

      });

    });

  });

  describe('ok', function () {

    it('should call close binding', function () {

      var close = jasmine.createSpy('close');
      var ctrl = $componentController('patientDeleteModal', null, {close: close});

      ctrl.ok();

      expect(close).toHaveBeenCalled();

    });

  });

  describe('cancel', function () {

    it('should call dismiss binding', function () {

      var dismiss = jasmine.createSpy('dismiss');
      var ctrl = $componentController('patientDeleteModal', null, {close: dismiss});

      ctrl.ok();

      expect(dismiss).toHaveBeenCalled();

    });

  });

});
