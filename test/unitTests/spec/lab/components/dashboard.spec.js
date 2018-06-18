describe('dashboardController', () => {

  var $componentController, $q, $state, patientService;

  beforeEach(module('lab'));
  beforeEach(inject((_$componentController_, _patientService_, _$q_, _$state_) => {
    $componentController = _$componentController_;
    $q = _$q_;
    patientService = _patientService_;
    $state = _$state_;
  }));

  describe('$onInit', () => {

    it('should get the patient', () => {
      spyOn(patientService, 'getPatient').and.callFake(() => $q(resolve => {
        resolve({});
      }));

      var ctrl = $componentController('dashboard');
      ctrl.$onInit();
      expect(patientService.getPatient).toHaveBeenCalled();
    });

  });

  describe('reload', () => {

    it('should reload current state', () => {

      spyOn($state, 'reload');

      var ctrl = $componentController('dashboard');
      ctrl.reload();

      expect($state.reload).toHaveBeenCalled();

    });

  });

});
