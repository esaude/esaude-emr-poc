describe('routes', function () {

  var patientService, $location, $rootScope, clinicalServicesService, $state;

  beforeEach(module('vitals', function ($provide, $translateProvider) {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });
    $translateProvider.useLoader('mergeLocaleFilesService');

    // Mock initialization because it is to be removed.
    $provide.factory('initialization', function ($q) {
      return $q.resolve({});
    });
  }));

  beforeEach(inject(function(_$location_, _$rootScope_, _$state_,  _patientService_, _clinicalServicesService_) {
    patientService = _patientService_;
    $location = _$location_;
    $rootScope = _$rootScope_;
    clinicalServicesService = _clinicalServicesService_;
    $state = _$state_;
  }));

  describe('dashboard', function () {

    var patient = {uuid: '05358ef6-06ba-49aa-95f5-3daee8378f2d'};

    beforeEach(function () {

      spyOn(patientService, 'getPatient');

      spyOn(clinicalServicesService, 'init');

    });

    it('should load the patient', function () {

      $location.url(`/dashboard/${patient.uuid}`);

      $rootScope.$apply();

      expect(patientService.getPatient).toHaveBeenCalledWith(patient.uuid);

    });

    it('should redirect to clinical services', function () {

      $location.url(`/dashboard/${patient.uuid}`);

      $rootScope.$apply();

      expect($state.current.name).toBe('dashboard.clinicalservices');

    });

  });

  describe('clinicalservices', function () {

    var patient = {uuid: '05358ef6-06ba-49aa-95f5-3daee8378f2d'};

    beforeEach(function () {

      spyOn(patientService, 'getPatient');

      spyOn(clinicalServicesService, 'init');

    });

    it('should initialize clinical services for current module', function () {

      $location.url(`/dashboard/${patient.uuid}/clinicalservices`);

      $rootScope.$apply();

      expect(clinicalServicesService.init).toHaveBeenCalledWith('vitals', patient.uuid);

    });

  });

});
