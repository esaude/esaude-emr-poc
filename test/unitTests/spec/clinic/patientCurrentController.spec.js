describe('PatientCurrentController', function () {

  var controller, $controller, $q, $rootScope, $http, $scope, $stateParams, patientService, encounterService;

  var PATIENT = { uuid: "UUID_1", age: { years: 20 } }

  var ENCOUNTER_1 = { uuid: 'ENC_UUID_1', encounterDateTime: new Date(), voided: false, obs: [] };
  var ENCOUNTERS = [ENCOUNTER_1];

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

  beforeEach(inject(function (_$controller_, _$q_, _$rootScope_, $httpBackend, _patientService_, _encounterService_) {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $http = $httpBackend;
    patientService = _patientService_;
    encounterService = _encounterService_;
  }));

  beforeEach(function () {
    spyOn(patientService, 'getPatient').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(PATIENT);
      });
    });
    spyOn(encounterService, 'getEncountersForEncounterType').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(ENCOUNTERS);
      });
    });
  });

  beforeEach(function () {
    $scope = {};
    $stateParams = { patientUuid: "UUID_1" };
    controller = $controller('PatientCurrentController', {
      $scope: $scope,
      $stateParams: $stateParams
    });
    $rootScope.$apply();
  });

  describe('activate', function () {
    it('should set encounters as lab results', function () {
      expect($scope["labResults"].length).toEqual(1);
      expect($scope["labResults"][0].length).toEqual(1);
      expect($scope["labResults"][0]).toEqual(ENCOUNTERS);
    });
  });

});
