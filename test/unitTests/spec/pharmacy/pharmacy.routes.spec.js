describe('pharmacy.routes', () => {

  const apps = [{id: 'pharmacy'}];

  const PHARMACY_APP_ID = 'pharmacy';

  let patientService, $location, $rootScope, $state, authorizationService, $q, $httpBackend, applicationService, sessionService;

  beforeEach(module('pharmacy', ($provide, $translateProvider) => {
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

  beforeEach(inject((_$location_, _$rootScope_, _$state_, _patientService_, _authorizationService_, _$q_, _$httpBackend_,
                     _applicationService_, _sessionService_) => {
    patientService = _patientService_;
    $location = _$location_;
    $rootScope = _$rootScope_;
    $state = _$state_;
    authorizationService = _authorizationService_;
    $q = _$q_;
    $httpBackend = _$httpBackend_;
    applicationService = _applicationService_;
    sessionService = _sessionService_;
  }));

  beforeEach(() => {
    spyOn(applicationService, 'getApps').and.returnValue($q.resolve(apps));
    spyOn(authorizationService, 'isUserAuthorizedForApp').and.returnValue($q.resolve(true));
  });

  describe('root', () => {

    it('should check if user is authorized to use pharmacy app', () => {

      $location.url('/search');

      $rootScope.$apply();

      expect(authorizationService.isUserAuthorizedForApp).toHaveBeenCalledWith(apps, PHARMACY_APP_ID);

    });

  });

  describe('dashboard', () => {

    var patient = {uuid: '05358ef6-06ba-49aa-95f5-3daee8378f2d'};

    beforeEach(() => {
      spyOn(patientService, 'getPatient');
    });

    it('should load the patient', () => {

      spyOn(authorizationService, 'hasRole').and.callFake(() => $q.resolve(false));

      $location.url(`/dashboard/${patient.uuid}`);

      $rootScope.$apply();

      expect(patientService.getPatient).toHaveBeenCalledWith(patient.uuid);

    });

    describe('redirect', () => {

      it('should check if user has independent pharmacist role', () => {

        spyOn(authorizationService, 'hasRole').and.callFake(() => $q.resolve(false));

        $location.url(`/dashboard/${patient.uuid}`);

        $rootScope.$apply();

        expect(authorizationService.hasRole)
          .toHaveBeenCalledWith(['POC: Pharmacist - Independent', 'POC: Pharmacist - Independent (Admin)']);
      });

      it('should redirect to prescriptions for independent pharmacists', () => {

        spyOn(authorizationService, 'hasRole').and.callFake(() => $q.resolve(true));

        $location.url(`/dashboard/${patient.uuid}`);

        $rootScope.$apply();

        expect($state.current.name).toBe('dashboard.prescriptions');

      });

      it('should redirect to FILA History for independent pharmacists', () => {

        spyOn(authorizationService, 'hasRole').and.callFake(() => $q.resolve(false));

        $location.url(`/dashboard/${patient.uuid}`);

        $rootScope.$apply();

        expect($state.current.name).toBe('dashboard.filaHistory');

      });

    });

  });

});
