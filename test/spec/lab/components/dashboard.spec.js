describe('dashboardController', function () {

  var $componentController, $q, patientService;

  beforeEach(module('lab'));
  beforeEach(inject(function(_$componentController_, _patientService_, _$q_) {
    $componentController = _$componentController_;
    $q = _$q_;
    patientService = _patientService_;
  }));

  describe('$onInit', function () {

    it('should get the patient', function () {
      spyOn(patientService, 'getPatient').and.callFake(function () {
        return $q(function (resolve) {
          resolve({});
        })
      });

      var ctrl = $componentController('dashboard');
      ctrl.$onInit();
      expect(patientService.getPatient).toHaveBeenCalled();
    });

  });

});
