describe('DashboardController', function () {

  var $controller, $state, $stateParams, patientService, visitService, $rootScope, authorizationService;

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

  beforeEach(inject(function (_$controller_, _$q_, _$rootScope_, _patientService_, _visitService_, _$state_,
                              _authorizationService_) {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    patientService = _patientService_;
    visitService = _visitService_;
    $state = _$state_;
    authorizationService = _authorizationService_;
  }));

  describe('activate', function () {

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

      var ctrl = $controller('DashboardController');

      expect(authorizationService.hasRole).toHaveBeenCalled();

    });

    it('should set independentPharmacist property', function () {

      var ctrl = $controller('DashboardController');

      $rootScope.$apply();

      expect(ctrl.independentPharmacist).toEqual(true);

    });

    it('should load the patient', function () {

      var ctrl = $controller('DashboardController');

      $rootScope.$apply();

      expect(ctrl.patient).toEqual({});

    });

  });


  describe('reload', function () {

    it('should reload current state', function () {

      spyOn($state, 'reload');

      var ctrl = $controller('DashboardController');
      ctrl.reload();

      expect($state.reload).toHaveBeenCalled();

    });

  });

});
