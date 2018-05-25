describe('patientCharts', function() {

  var $componentController, $q, $rootScope, encounterService, patientService;

  beforeEach(module('clinic', function ($provide, $translateProvider, $urlRouterProvider) {
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

  beforeEach(inject(function(_$componentController_, _$q_, _$rootScope_, _encounterService_, _patientService_) {
    $componentController = _$componentController_;
    $q = _$q_;
    encounterService = _encounterService_;
    patientService = _patientService_;
    $rootScope = _$rootScope_;
  }));

  describe('$onInit', function () {

    it('should load the patient', function () {

      spyOn(patientService, 'getPatient').and.returnValue($q.resolve({}));

      var ctrl = $componentController('patientCharts');

      ctrl.$onInit();

      expect(patientService.getPatient).toHaveBeenCalled();

    });


    it('should load patient lab encounters', function () {

      spyOn(patientService, 'getPatient').and.returnValue($q.resolve({}));

      spyOn(encounterService, 'getEncountersForEncounterType').and.returnValue($q.resolve([]));

      var ctrl = $componentController('patientCharts');

      ctrl.$onInit();

      $rootScope.$apply();

      // TODO: not necessary to load it twice, optimize this.
      expect(encounterService.getEncountersForEncounterType).toHaveBeenCalledTimes(2);

    });

    xit('should load and process cd4 lab results for displaying in charts');

    xit('should load and process other lab results for displaying in charts');

  });

});

