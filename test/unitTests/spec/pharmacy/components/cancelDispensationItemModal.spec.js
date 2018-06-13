describe('cancelDispensationItemModal', function () {

  var $componentController;

  beforeEach(module('pharmacy'));

  beforeEach(inject(function (_$componentController_) {
    $componentController = _$componentController_;
  }));

  describe('ok', function () {

    it('should call close binding', function () {

      var close = jasmine.createSpy('close');

      var ctrl = $componentController('cancelDispensationItemModal', null, {close: close, resolve: {}});

      ctrl.cancelationReason = 'Canceled';

      ctrl.ok();

      expect(close).toHaveBeenCalledWith({$value: 'Canceled'});
    });

  });

  describe('cancel', function () {

    it('should call dismiss binding', function () {

      var dismiss = jasmine.createSpy('dismiss');

      var ctrl = $componentController('cancelDispensationItemModal', null, {dismiss: dismiss, resolve: {}});

      ctrl.cancel();

      expect(dismiss).toHaveBeenCalledWith({$value: 'cancel'});

    });

  });

});
