describe('cancelPrescriptionModal', () => {

  var $componentController, $q, $state, $rootScope, conceptService, encounterService, providerService;

  beforeEach(module('poc.common.prescription'));
  beforeEach(inject((_$componentController_, _$q_, _$state_, _$rootScope_, _conceptService_, _encounterService_, _providerService_) => {
    $componentController = _$componentController_;
    $q = _$q_;
    $state = _$state_;
    $rootScope = _$rootScope_;
    conceptService = _conceptService_;
    encounterService = _encounterService_;
    providerService = _providerService_;
  }));


  describe('$onInit', () => {

    it('should assign values from resolve', () => {

      var prescriptionItemToCancel = {drugOrder: {action: 'NEW'}};
      var cancellationReasons = [];
      var ctrl = $componentController('cancelPrescriptionModal', null, {resolve: {prescriptionItemToCancel,cancellationReasons}});

      ctrl.$onInit();

    });

  });

  describe('ok', () => {

    it('should call close binding', () => {

      var close = jasmine.createSpy('close');
      var ctrl = $componentController('cancelPrescriptionModal', null, {close});

      var cancellationReason = 'TOXICITY';
      ctrl.cancellationReason = cancellationReason;

      ctrl.ok({$valid: true});

      expect(close).toHaveBeenCalledWith({$value: {cancellationReason}});

    });

    describe('form not valid', () => {

      it('should show messages', () => {

        var close = jasmine.createSpy('close');
        var ctrl = $componentController('cancelPrescriptionModal', null, {close});

        ctrl.ok({$valid: false});

        expect(ctrl.showMessages).toEqual(true);

      });

    });

  });

  describe('cancel', () => {

    it('should call dismiss binding', () => {

      var dismiss = jasmine.createSpy('dismiss');
      var ctrl = $componentController('cancelPrescriptionModal', null, {dismiss});

      ctrl.cancel();

      expect(dismiss).toHaveBeenCalled();

    });

  });

  describe('searchProviders', () => {

    it('should search providers', () => {

      spyOn(providerService, 'getProviders').and.returnValue($q.resolve([]));

      var ctrl = $componentController('cancelPrescriptionModal');

      var term = 'Loria';

      ctrl.searchProviders(term);

      expect(providerService.getProviders).toHaveBeenCalledWith(term);

    });

  });

});
