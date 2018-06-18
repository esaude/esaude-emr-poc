describe('PatientCurrentController', () => {

  var controller, $componentController, $q, $rootScope, $http, $scope, $stateParams, patientService, encounterService;

  var PATIENT = { uuid: "UUID_1", age: { years: 20 } };

  var ENCOUNTER_1 = { uuid: 'ENC_UUID_1', encounterDateTime: new Date(), voided: false, obs: [] };
  var ENCOUNTERS = [ENCOUNTER_1];

  beforeEach(module('clinic', ($provide, $translateProvider, $urlRouterProvider) => {
    $provide.factory('mergeLocaleFilesService', $q => () => {
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject((_$componentController_, _$q_, _$rootScope_, $httpBackend, _patientService_, _encounterService_) => {
    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $http = $httpBackend;
    patientService = _patientService_;
    encounterService = _encounterService_;
  }));

  beforeEach(() => {
    spyOn(patientService, 'getPatient').and.callFake(() => $q(resolve => resolve(PATIENT)));
    spyOn(encounterService, 'getEncountersForEncounterType').and.callFake(() => $q(resolve => resolve(ENCOUNTERS)));
  });

  beforeEach(() => {
    $scope = {};
    $stateParams = { patientUuid: "UUID_1" };
    controller = $componentController('patientCurrent', null, {patient: {uuid: 'uuid', age: {years: 15}}});
    $rootScope.$apply();
  });

  describe('$onInit', () => {

    it('should set encounters as lab results', () => {

      controller.$onInit();

      $rootScope.$apply();

      expect(controller.labResults.length).toEqual(1);

      expect(controller.labResults[0].length).toEqual(1);

      expect(controller.labResults[0]).toEqual(ENCOUNTERS);
    });
  });

});
