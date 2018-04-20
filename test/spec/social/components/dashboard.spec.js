describe('dashboardController', function () {

  var $componentController, $q, $state;

  beforeEach(module('social'));
  beforeEach(inject(function(_$componentController_, _$q_, _$state_) {
    $componentController = _$componentController_;
    $q = _$q_;
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
