describe('formDisplay', () => {

  var $componentController, $q, clinicalServicesService, patientService, $rootScope;

  beforeEach(module('poc.common.clinicalservices'));

  beforeEach(inject((_$componentController_, _clinicalServicesService_, _patientService_, _$q_, _$rootScope_) => {
    $componentController = _$componentController_;
    clinicalServicesService = _clinicalServicesService_;
    patientService = _patientService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('$onInit', () => {

    beforeEach(() => {
      spyOn(clinicalServicesService, 'getFormLayouts').and.returnValue({});

      spyOn(clinicalServicesService, 'getFormData').and.callFake(() => $q(resolve => resolve({})));

      spyOn(patientService, 'getPatient').and.callFake(() => $q(resolve => resolve({})));
    });

    it('should get form layouts', () => {

      var ctrl = $componentController('formDisplay');

      ctrl.$onInit();

      $rootScope.$apply();
      expect(clinicalServicesService.getFormLayouts).toHaveBeenCalled();
    });

    it('should get the patient', () => {

      var ctrl = $componentController('formDisplay');

      ctrl.$onInit();

      $rootScope.$apply();
      expect(patientService.getPatient).toHaveBeenCalled();
    });


    it('should get form data', () => {

      var ctrl = $componentController('formDisplay');

      ctrl.$onInit();

      $rootScope.$apply();
      expect(clinicalServicesService.getFormData).toHaveBeenCalled();
    });

  });

});
