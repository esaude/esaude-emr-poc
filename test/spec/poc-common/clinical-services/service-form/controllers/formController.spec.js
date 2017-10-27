describe('FormController', function () {

  var $controller;
  var clinicalServicesService = {
    getFormLayouts: function () { },
    getFormData: function () { }
  };
  var $q;
  var spinner = { forPromise: function () { } };
  var $scope = {};
  var PATIENT_EDRISSE = { name: "Edrisse" };
  var LAST_ENCOUNTER = { encounterDateTime: null };
  var FORM_DATA = { service: { lastEncounterForService: LAST_ENCOUNTER } };

  beforeEach(module('poc.common.clinicalservices.serviceform', function () {
  }));

  beforeEach(inject(function (_$controller_, _$q_) {

    $q = _$q_;

    spyOn(clinicalServicesService, 'getFormLayouts').and.callFake(function () {
      return { parts: [] };
    });

    spyOn(clinicalServicesService, 'getFormData').and.callFake(function () {
      return {};
    });

    spyOn(spinner, 'forPromise').and.callFake(function () {
    });

    spyOn($q, 'all').and.callFake(function () {
      return {
        then: function (callback) {
          callback([PATIENT_EDRISSE,
            FORM_DATA,
            null]);
        },
        finally: function () { }
      };
    });

    $controller = _$controller_('FormController', {
      $scope: $scope,
      clinicalServicesService: clinicalServicesService,
      createEncounterMapper: {},
      updateEncounterMapper: {},
      $q: $q,
      spinner: spinner
    });

  }));

  describe('activate', function () {
    it('should initialize necessary data', function () {
      expect($scope.previousEncounter).not.toBeNull();
      expect($scope.patient).toEqual(PATIENT_EDRISSE);
      expect($scope.formPayload).toEqual(FORM_DATA);
      expect($scope.hasVisitToday).toBeFalsy();
    });

  });

  describe('getPreviousEncounter', function () {
    it('previous encounter should be last encounter when no service encounter', function () {
      var previousEncounter = $controller.getPreviousEncounter(FORM_DATA, null);
      expect(previousEncounter).toEqual(LAST_ENCOUNTER);
    });

    it('previous encounter should be null when no service encounter is found with same UUID', function () {
      var previousEncounter =
        $controller.getPreviousEncounter({
          service: {
            encountersForService: [{ uuid: "UUID1" }, { uuid: "UUID3" }]
          }
        }, { uuid: "UUID2" });
      expect(previousEncounter).toBeNull();
    });

    it('previous encounter should be the on next to service encounter', function () {
      var previousEncounter =
        $controller.getPreviousEncounter({
          service: {
            encountersForService: [{ uuid: "UUID1" }, { uuid: "UUID2" }, { uuid: "UUID3" }]
          }
        }, { uuid: "UUID2" });
      expect(previousEncounter.uuid).toEqual("UUID3");
    });

    it('previous encounter should be null when there is no next encounter to service encounter', function () {
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
