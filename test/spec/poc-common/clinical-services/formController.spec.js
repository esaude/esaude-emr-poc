describe('FormController', function () {

  var $controller, $q, $rootScope, clinicalServicesService, patientService, visitService;

  beforeEach(module('poc.common.clinicalservices'));

  beforeEach(inject(function (_$controller_, _$q_, _$rootScope_, _clinicalServicesService_, _patientService_, _visitService_) {
    $controller = _$controller_;
    clinicalServicesService = _clinicalServicesService_;
    patientService = _patientService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    visitService = _visitService_;
  }));

  describe('activate', function () {

    beforeEach(function () {

      spyOn(clinicalServicesService, 'getFormLayouts').and.returnValue([]);

      spyOn(clinicalServicesService, 'getFormData').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({
            service: {
              lastEncounterForService: {}
            }
          });
        });
      });

      spyOn(visitService, 'getTodaysVisit').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      spyOn(patientService, 'getPatient').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      var formController = $controller('FormController', {
        $scope: {}
      });

    });

    it('should load form layouts', function () {
      $rootScope.$apply();
      expect(clinicalServicesService.getFormLayouts).toHaveBeenCalled();
    });

    it('should load form data', function () {
      $rootScope.$apply();
      expect(clinicalServicesService.getFormData).toHaveBeenCalled();
    });

    it('should load the patient', function () {
      $rootScope.$apply();
      expect(patientService.getPatient).toHaveBeenCalled();
    });

    it('should get todays visit', function () {
      $rootScope.$apply();
      expect(patientService.getPatient).toHaveBeenCalled();
    });

  });

});
