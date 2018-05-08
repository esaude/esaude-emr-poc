describe('formDisplay', function () {

  var $componentController, $q, clinicalServicesService, patientService, $rootScope;

  beforeEach(module('poc.common.clinicalservices'));

  beforeEach(inject(function (_$componentController_, _clinicalServicesService_, _patientService_, _$q_, _$rootScope_) {
    $componentController = _$componentController_;
    clinicalServicesService = _clinicalServicesService_;
    patientService = _patientService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('$onInit', function () {

    beforeEach(function () {
      spyOn(clinicalServicesService, 'getFormLayouts').and.returnValue({});

      spyOn(clinicalServicesService, 'getFormData').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      spyOn(patientService, 'getPatient').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });
    });

    it('should get form layouts', function () {

      var ctrl = $componentController('formDisplay');

      ctrl.$onInit();

      $rootScope.$apply();
      expect(clinicalServicesService.getFormLayouts).toHaveBeenCalled();
    });

    it('should get the patient', function () {

      var ctrl = $componentController('formDisplay');

      ctrl.$onInit();

      $rootScope.$apply();
      expect(patientService.getPatient).toHaveBeenCalled();
    });


    it('should get form data', function () {

      var ctrl = $componentController('formDisplay');

      ctrl.$onInit();

      $rootScope.$apply();
      expect(clinicalServicesService.getFormData).toHaveBeenCalled();
    });

  });

});
