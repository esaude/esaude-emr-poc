describe('routes', () => {

  const apps = [{id: 'vitals'}];

  const VITALS_APP_ID = 'vitals';

  let patientService, $location, $rootScope, clinicalServicesService, $state, applicationService, authorizationService, $q;

  beforeEach(module('vitals', ($provide, $translateProvider) => {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', $q => () => {
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    });
    $translateProvider.useLoader('mergeLocaleFilesService');

    // Mock initialization because it is to be removed.
    $provide.factory('initialization', $q => $q.resolve({}));
  }));

  beforeEach(inject((_$location_, _$rootScope_, _$state_, _patientService_, _clinicalServicesService_,
                     _applicationService_, _authorizationService_, _$q_) => {
    patientService = _patientService_;
    $location = _$location_;
    $rootScope = _$rootScope_;
    clinicalServicesService = _clinicalServicesService_;
    $state = _$state_;
    applicationService = _applicationService_;
    authorizationService = _authorizationService_;
    $q = _$q_;
  }));

  beforeEach(() => {
    spyOn(applicationService, 'getApps').and.returnValue($q.resolve(apps));
    spyOn(authorizationService, 'isUserAuthorizedForApp').and.returnValue($q.resolve(true));
  });

  describe('root', () => {

    it('should check if user is authorized to use pharmacy app', () => {

      $location.url('/search');

      $rootScope.$apply();

      expect(authorizationService.isUserAuthorizedForApp).toHaveBeenCalledWith(apps, VITALS_APP_ID);

    });

  });

  describe('dashboard', () => {

    var patient = {uuid: '05358ef6-06ba-49aa-95f5-3daee8378f2d'};

    beforeEach(() => {

      spyOn(patientService, 'getPatient');

      spyOn(clinicalServicesService, 'init');

    });

    it('should load the patient', () => {

      $location.url(`/dashboard/${patient.uuid}`);

      $rootScope.$apply();

      expect(patientService.getPatient).toHaveBeenCalledWith(patient.uuid);

    });

    it('should redirect to clinical services', () => {

      $location.url(`/dashboard/${patient.uuid}`);

      $rootScope.$apply();

      expect($state.current.name).toBe('dashboard.clinicalservices');

    });

  });

  describe('clinicalservices', () => {

    var patient = {uuid: '05358ef6-06ba-49aa-95f5-3daee8378f2d'};

    beforeEach(() => {

      spyOn(patientService, 'getPatient');

      spyOn(clinicalServicesService, 'init');

    });

    it('should initialize clinical services for current module', () => {

      $location.url(`/dashboard/${patient.uuid}/clinicalservices`);

      $rootScope.$apply();

      expect(clinicalServicesService.init).toHaveBeenCalledWith('vitals', patient.uuid);

    });

  });

});
