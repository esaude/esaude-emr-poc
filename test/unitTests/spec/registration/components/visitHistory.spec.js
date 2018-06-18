describe('visitHistory', () => {

  var $componentController, $state, patientService, visitService, $rootScope, $q;

  beforeEach(module('registration', ($provide, $translateProvider, $urlRouterProvider) => {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', $q => () => {
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject((_$componentController_, _$q_, _$rootScope_, _patientService_, _visitService_, _$state_) => {
    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    patientService = _patientService_;
    visitService = _visitService_;
    $state = _$state_;
  }));

  describe('$onInit', () => {

    it('should load visit history for given patient', () => {

      var patient = {uuid: "3951a5f8-cdce-4421-bfe3-cfdd701168d0"};

      spyOn(visitService, 'getVisitHistoryForPatient').and.callFake(() => $q.resolve([]));

      var ctrl = $componentController('visitHistory', null, {patient});

      ctrl.$onInit();

      expect(visitService.getVisitHistoryForPatient).toHaveBeenCalledWith(patient);

    });

  });

});
