describe('dashboard', function () {

  var $componentController, $state;

  beforeEach(module('vitals'));

  beforeEach(inject(function (_$componentController_, _$q_, _$rootScope_, _patientService_, _visitService_, _$state_) {
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
