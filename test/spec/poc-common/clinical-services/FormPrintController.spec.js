describe('FormPrintController', function () {

  var $controller, $q, $state, $stateParams, clinicalServicesService, notifier, patientService, spinner,
    translateFilter, $rootScope;

  beforeEach(module('poc.common.clinicalservices'));

  beforeEach(inject(function (_$controller_, _clinicalServicesService_, _patientService_, _$q_, _$rootScope_) {
    $controller = _$controller_;
    clinicalServicesService = _clinicalServicesService_;
    patientService = _patientService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('activate', function () {

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

      var ctrl = $controller('FormPrintController');

      $rootScope.$apply();
      expect(clinicalServicesService.getFormLayouts).toHaveBeenCalled();
    });

    it('should get the patient', function () {

      var ctrl = $controller('FormPrintController');

      $rootScope.$apply();
      expect(patientService.getPatient).toHaveBeenCalled();
    });


    it('should get form data', function () {

      var ctrl = $controller('FormPrintController');

      $rootScope.$apply();
      expect(clinicalServicesService.getFormData).toHaveBeenCalled();
    });

  });

});
