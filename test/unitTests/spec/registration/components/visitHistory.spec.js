describe('visitHistory', function () {

  var $componentController, $state, patientService, visitService, $rootScope, $q;

  beforeEach(module('registration', function ($provide, $translateProvider, $urlRouterProvider) {
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

  beforeEach(inject(function (_$componentController_, _$q_, _$rootScope_, _patientService_, _visitService_, _$state_) {
    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    patientService = _patientService_;
    visitService = _visitService_;
    $state = _$state_;
  }));

  describe('$onInit', function () {

    it('should load visit history for given patient', function () {

      var patient = {uuid: "3951a5f8-cdce-4421-bfe3-cfdd701168d0"};

      spyOn(visitService, 'getVisitHistoryForPatient').and.callFake(function () {
        return $q.resolve([]);
      });

      var ctrl = $componentController('visitHistory', null, {patient});

      ctrl.$onInit();

      expect(visitService.getVisitHistoryForPatient).toHaveBeenCalledWith(patient);

    });

  });

});
