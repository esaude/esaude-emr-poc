describe('cancelDispensationItemModal', () => {

  var $componentController;

  beforeEach(module('pharmacy'));

  beforeEach(inject(_$componentController_ => {
    $componentController = _$componentController_;
  }));

  describe('ok', () => {

    it('should call close binding', () => {

      var close = jasmine.createSpy('close');

      var ctrl = $componentController('cancelDispensationItemModal', null, {close: close, resolve: {}});

      ctrl.cancelationReason = 'Canceled';

      ctrl.ok();

      expect(close).toHaveBeenCalledWith({$value: 'Canceled'});
    });

  });

  describe('cancel', () => {

    it('should call dismiss binding', () => {

      var dismiss = jasmine.createSpy('dismiss');

      var ctrl = $componentController('cancelDispensationItemModal', null, {dismiss: dismiss, resolve: {}});

      ctrl.cancel();

      expect(dismiss).toHaveBeenCalledWith({$value: 'cancel'});

    });

  });

});
