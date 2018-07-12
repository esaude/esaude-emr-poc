describe('dateAndProviderModal', () => {

  var $componentController, $q, $state, $rootScope, conceptService, encounterService;

  beforeEach(module('poc.common.prescription'));
  beforeEach(inject((_$componentController_, _$q_, _$state_, _$rootScope_, _conceptService_, _encounterService_) => {
    $componentController = _$componentController_;
    $q = _$q_;
    $state = _$state_;
    $rootScope = _$rootScope_;
    conceptService = _conceptService_;
    encounterService = _encounterService_;
  }));


  describe('ok', () => {

    it('should call close binding', () => {

      var close = jasmine.createSpy('close');
      var ctrl = $componentController('dateAndProviderModal', null, {close});

      var date = new Date();
      var provider = {display: '290-7 - Joana Albino'};

      ctrl.prescriptionDate = date;
      ctrl.selectedProvider = provider;

      ctrl.ok({$valid: true});

      expect(close).toHaveBeenCalledWith({$value: {date, provider}});

    });

    describe('form not valid', () => {

      it('should show messages', () => {

        var close = jasmine.createSpy('close');
        var ctrl = $componentController('dateAndProviderModal', null, {close});

        ctrl.ok({$valid: false});

        expect(ctrl.showMessages).toEqual(true);

      });

    });

  });

  describe('cancel', () => {

    it('should call dismiss binding', () => {

      var dismiss = jasmine.createSpy('dismiss');
      var ctrl = $componentController('dateAndProviderModal', null, {dismiss});

      ctrl.cancel();

      expect(dismiss).toHaveBeenCalled();

    });

  });

});
