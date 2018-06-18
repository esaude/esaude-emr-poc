describe('dashboard', () => {

  var $componentController, $state, patientService, visitService, $rootScope, authorizationService, $q;

  beforeEach(module('pharmacy', ($provide, $translateProvider, $urlRouterProvider) => {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', $q => () => {
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject((_$componentController_, _$q_, _$rootScope_, _patientService_, _visitService_, _$state_,
                     _authorizationService_) => {
    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    patientService = _patientService_;
    visitService = _visitService_;
    $state = _$state_;
    authorizationService = _authorizationService_;
  }));

  describe('$onInit', () => {

    beforeEach(() => {

      spyOn(authorizationService, 'hasRole').and.callFake(() => $q(resolve => resolve(true)));

      spyOn(patientService, 'getPatient').and.callFake(() => $q(resolve => resolve({})));

    });

    it('should check if user is independent pharmacist', () => {

      var ctrl = $componentController('dashboard');

      ctrl.$onInit();

      expect(authorizationService.hasRole).toHaveBeenCalled();

    });

    it('should set independentPharmacist property', () => {

      var ctrl = $componentController('dashboard');

      ctrl.$onInit();

      $rootScope.$apply();

      expect(ctrl.independentPharmacist).toEqual(true);

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
