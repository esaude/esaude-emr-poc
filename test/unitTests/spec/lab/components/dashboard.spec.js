describe('dashboardController', function () {

  var $componentController, $q, $state, patientService;

  beforeEach(module('lab'));
  beforeEach(inject(function(_$componentController_, _patientService_, _$q_, _$state_) {
    $componentController = _$componentController_;
    $q = _$q_;
    patientService = _patientService_;
    $state = _$state_;
  }));

  describe('$onInit', function () {

    it('should get the patient', function () {
      spyOn(patientService, 'getPatient').and.callFake(function () {
        return $q(function (resolve) {
          resolve({});
        });
      });

      var ctrl = $componentController('dashboard');
      ctrl.$onInit();
      expect(patientService.getPatient).toHaveBeenCalled();
    });

  });

  describe('reload', function () {

    it('should reload current state', function () {

      spyOn($state, 'reload');

      var ctrl = $componentController('dashboard');
      ctrl.reload();

      expect($state.reload).toHaveBeenCalled();

    });

  });

});
