describe('DashboardController', function () {

  var $componentController, $state;

  beforeEach(module('social'));

  beforeEach(inject(function (_$componentController_, _$state_) {
    $componentController = _$componentController_;
    $state = _$state_;
  }));

  describe('reload', function () {

    it('should reload current state', function () {

      spyOn($state, 'reload');

      var ctrl = $componentController('dashboard');

      ctrl.reload();

      expect($state.reload).toHaveBeenCalled();

    });

  });

});
