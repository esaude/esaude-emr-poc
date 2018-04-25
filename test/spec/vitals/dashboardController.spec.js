describe('DashboardController', function () {

  var $controller, $state, $stateParams, patientService, visitService, $rootScope;

  beforeEach(module('vitals', function ($provide, $translateProvider, $urlRouterProvider) {
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

  beforeEach(inject(function (_$controller_, _$q_, _$rootScope_, _patientService_, _visitService_, _$state_) {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    patientService = _patientService_;
    visitService = _visitService_;
    $state = _$state_;
  }));

  describe('activate', function () {

    var ctrl;

    beforeEach(function () {
      spyOn(patientService, 'getPatient').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      spyOn(visitService, 'getTodaysVisit').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      ctrl = $controller('DashboardController');

    });

    it('should load the patient', function () {
      $rootScope.$apply();
      expect(patientService.getPatient).toHaveBeenCalled();
    });

    it('should load todays visit', function () {
      $rootScope.$apply();
      expect(visitService.getTodaysVisit).toHaveBeenCalled();
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
