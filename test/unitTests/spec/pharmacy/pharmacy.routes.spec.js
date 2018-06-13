describe('pharmacy.routes', function () {

  var patientService, $location, $rootScope, $state, authorizationService, $q, $httpBackend;

  beforeEach(module('pharmacy', function ($provide, $translateProvider) {
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

  beforeEach(inject(function(_$location_, _$rootScope_, _$state_, _patientService_, _authorizationService_, _$q_, _$httpBackend_) {
    patientService = _patientService_;
    $location = _$location_;
    $rootScope = _$rootScope_;
    $state = _$state_;
    authorizationService =_authorizationService_;
    $q = _$q_;
    $httpBackend = _$httpBackend_;
  }));

  describe('dashboard', function () {

    var patient = {uuid: '05358ef6-06ba-49aa-95f5-3daee8378f2d'};

    beforeEach(function () {
      spyOn(patientService, 'getPatient');
    });

    it('should load the patient', function () {

      spyOn(authorizationService, 'hasRole').and.callFake(function () {
        return $q.resolve(false);
      });

      $location.url(`/dashboard/${patient.uuid}`);

      $rootScope.$apply();

      expect(patientService.getPatient).toHaveBeenCalledWith(patient.uuid);

    });

    describe('redirect', function () {

      it('should check if user has independent pharmacist role', function () {

        spyOn(authorizationService, 'hasRole').and.callFake(function () {
          return $q.resolve(false);
        });

        $location.url(`/dashboard/${patient.uuid}`);

        $rootScope.$apply();

        expect(authorizationService.hasRole)
          .toHaveBeenCalledWith(['POC: Pharmacist - Independent', 'POC: Pharmacist - Independent (Admin)']);
      });

      it('should redirect to prescriptions for independent pharmacists', function () {

        // TODO just remove after refactoring prescription
        $httpBackend.expectGET('views/patient-simplified-prescriptions.html').respond('');

        spyOn(authorizationService, 'hasRole').and.callFake(function () {
          return $q.resolve(true);
        });

        $location.url(`/dashboard/${patient.uuid}`);

        $httpBackend.flush();

        $rootScope.$apply();

        expect($state.current.name).toBe('dashboard.prescriptions');

      });

      it('should redirect to FILA History for independent pharmacists', function () {

        spyOn(authorizationService, 'hasRole').and.callFake(function () {
          return $q.resolve(false);
        });

        $location.url(`/dashboard/${patient.uuid}`);

        $rootScope.$apply();

        expect($state.current.name).toBe('dashboard.filaHistory');

      });

    });

  });

});
