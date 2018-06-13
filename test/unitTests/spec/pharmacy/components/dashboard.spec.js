describe('dashboard', function () {

  var $componentController, $state, patientService, visitService, $rootScope, authorizationService, $q;

  beforeEach(module('pharmacy', function ($provide, $translateProvider, $urlRouterProvider) {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject(function (_$componentController_, _$q_, _$rootScope_, _patientService_, _visitService_, _$state_,
                              _authorizationService_) {
    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    patientService = _patientService_;
    visitService = _visitService_;
    $state = _$state_;
    authorizationService = _authorizationService_;
  }));

  describe('$onInit', function () {

    beforeEach(function () {

      spyOn(authorizationService, 'hasRole').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(true);
        });
      });

      spyOn(patientService, 'getPatient').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

    });

    it('should check if user is independent pharmacist', function () {

      var ctrl = $componentController('dashboard');

      ctrl.$onInit();

      expect(authorizationService.hasRole).toHaveBeenCalled();

    });

    it('should set independentPharmacist property', function () {

      var ctrl = $componentController('dashboard');

      ctrl.$onInit();

      $rootScope.$apply();

      expect(ctrl.independentPharmacist).toEqual(true);

    });

  });


  describe('reload', function () {

    it('should reload current state', function () {

      spyOn($state, 'reload');

      var ctrl = $componentController('dashboard');
      ctrl.reload();

      expect($state.reload).toHaveBeenCalled();

    });

  });

});
