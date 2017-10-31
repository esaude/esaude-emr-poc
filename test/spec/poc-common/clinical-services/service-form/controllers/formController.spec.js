describe('FormController', function () {

  var $controller;
  var clinicalServicesService = {
    getFormLayouts: function () { },
    getFormData: function () { }
  };
  var $q;
  var $rootScope;
  var $scope;
  var $http;
  var patientService;
  var visitService;
  var spinner = { forPromise: function () { } };
  var PATIENT_EDRISSE = { name: "Edrisse", uuid: "P001" };
  var LAST_ENCOUNTER = { encounterDateTime: null };
  var FORM_DATA = { service: { lastEncounterForService: LAST_ENCOUNTER } };

  beforeEach(module('poc.common.clinicalservices.serviceform'));

  beforeEach(inject(function (_$controller_, _$q_, _$rootScope_, _$httpBackend_, _patientService_, _visitService_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $http = _$httpBackend_;
    patientService = _patientService_;
    visitService = _visitService_;

    spyOn(clinicalServicesService, 'getFormLayouts').and.callFake(function () {
      return { parts: [] };
    });

    spyOn(patientService, 'getPatient').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(PATIENT_EDRISSE);
      });
    });

    spyOn(clinicalServicesService, 'getFormData').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(FORM_DATA);
      });
    });

    spyOn(visitService, 'getTodaysVisit').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(null);
      });
    });

    spyOn(spinner, 'forPromise').and.callFake(function () {
    });

    $controller = _$controller_('FormController', {
      $scope: $scope,
      clinicalServicesService: clinicalServicesService,
      createEncounterMapper: {},
      updateEncounterMapper: {},
      $q: $q,
      spinner: spinner,
      patientService: patientService,
      $stateParams: { patientUuid: "P001" }
    });

  }));

  describe('activate', function () {
    it('should load form data', function () {
      $rootScope.$apply();
      expect($scope.formPayload).toEqual(FORM_DATA);
    });

    it('should load the patient', function () {
      $rootScope.$apply();
      expect($scope.patient).toEqual(PATIENT_EDRISSE);
    });

    it('should get todays visit', function () {
      $rootScope.$apply();
      expect($scope.hasVisitToday).toBeFalsy();
    });

    it('should load previous encounter', function () {
      $rootScope.$apply();
      expect($scope.previousEncounter).not.toBeNull();
    });

  });

  describe('getPreviousEncounter', function () {
    it('previous encounter should be last encounter when no service encounter', function () {
      $rootScope.$apply();
      var previousEncounter = $controller.getPreviousEncounter(FORM_DATA, null);
      expect(previousEncounter).toEqual(LAST_ENCOUNTER);
    });

    it('previous encounter should be null when no service encounter is found with same UUID', function () {
      $rootScope.$apply();
      var previousEncounter =
        $controller.getPreviousEncounter({
          service: {
            encountersForService: [{ uuid: "UUID1" }, { uuid: "UUID3" }]
          }
        }, { uuid: "UUID2" });
      expect(previousEncounter).toBeNull();
    });

    it('previous encounter should be the on next to service encounter', function () {
      $rootScope.$apply();
      var previousEncounter =
        $controller.getPreviousEncounter({
          service: {
            encountersForService: [{ uuid: "UUID1" }, { uuid: "UUID2" }, { uuid: "UUID3" }]
          }
        }, { uuid: "UUID2" });
      expect(previousEncounter.uuid).toEqual("UUID3");
    });

    it('previous encounter should be null when there is no next encounter to service encounter', function () {
      $rootScope.$apply();
      var previousEncounter =
        $controller.getPreviousEncounter({
          service: {
            encountersForService: [{ uuid: "UUID1" }, { uuid: "UUID2" }]
          }
        }, { uuid: "UUID2" });
      expect(previousEncounter).toBeNull();
    });

  });
});
