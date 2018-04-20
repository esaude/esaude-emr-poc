describe('dashboardController', function () {

  var $controller, $state;

  beforeEach(module('registration'));

  beforeEach(inject(function (_$controller_, _$state_) {
    $controller = _$controller_;
    $state = _$state_;
  }));

  describe('reload', function () {

    it('should reload current state', function () {

      spyOn($state, 'reload');

      var ctrl = $controller('DashboardController');

      ctrl.reload();

      expect($state.reload).toHaveBeenCalled();

    });

  });

});
