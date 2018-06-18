describe('dashboardController', () => {

  var $componentController, $q, $state;

  beforeEach(module('social'));
  beforeEach(inject((_$componentController_, _$q_, _$state_) => {
    $componentController = _$componentController_;
    $q = _$q_;
    $state = _$state_;
  }));

  describe('reload', () => {

    it('should reload current state', () => {

      spyOn($state, 'reload');

      var ctrl = $componentController('dashboard');

      ctrl.reload();

      expect($state.reload).toHaveBeenCalled();

    });

  });

});
