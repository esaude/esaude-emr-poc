describe('FormWizardController', function () {

  var ctrl;
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
  var FORM_DATA = { service: { lastEncounterForService: LAST_ENCOUNTER, hasEntryToday: false } };

  beforeEach(module('poc.common.clinicalservices.serviceform'));

  beforeEach(inject(function (_$componentController_, _$q_, _$rootScope_, _$httpBackend_, _patientService_, _visitService_) {
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

    ctrl = _$componentController_('formWizard', {
      $scope: $scope,
      clinicalServicesService: clinicalServicesService,
      createEncounterMapper: {},
      updateEncounterMapper: {},
      $q: $q,
      patientService: patientService,
      $stateParams: { patientUuid: "P001" }
    });

  }));

  describe('$onInit', function () {
    it('should load form data', function () {
      ctrl.$onInit();
      $rootScope.$apply();
      expect(ctrl.formPayload).toEqual(FORM_DATA);
    });

    it('should load the patient', function () {
      ctrl.$onInit();
      $rootScope.$apply();
      expect(ctrl.patient).toEqual(PATIENT_EDRISSE);
    });

    it('should get todays visit', function () {
      ctrl.$onInit();
      $rootScope.$apply();
      expect($scope.hasVisitToday).toBeFalsy();
    });

    it('should load previous encounter', function () {
      ctrl.$onInit();
      $rootScope.$apply();
      expect($scope.previousEncounter).not.toBeNull();
    });

  });

  describe('getPreviousEncounter', function () {
    it('previous encounter should be last encounter when no occurence of the service in the current visit', function () {
      $rootScope.$apply();
      var previousEncounter = ctrl.getPreviousEncounter(FORM_DATA, null);
      expect(previousEncounter).toEqual(LAST_ENCOUNTER);
    });

    it('previous encounter should be null when no service encounter is found with same UUID', function () {
      $rootScope.$apply();
      var previousEncounter =
        ctrl.getPreviousEncounter({
          service: {
            encountersForService: [{ uuid: "UUID1" }, { uuid: "UUID3" }],
            hasEntryToday: true
          }
        }, { uuid: "UUID2" });
      expect(previousEncounter).toBeNull();
    });

    it('previous encounter should be the next to service encounter', function () {
      $rootScope.$apply();
      var previousEncounter =
        ctrl.getPreviousEncounter({
          service: {
            encountersForService: [{ uuid: "UUID1" }, { uuid: "UUID2" }, { uuid: "UUID3" }],
            hasEntryToday: true
          }
        }, { uuid: "UUID2" });
      expect(previousEncounter.uuid).toEqual("UUID3");
    });

    it('previous encounter should be null when there is no next encounter to service encounter', function () {
      $rootScope.$apply();
      var previousEncounter =
        ctrl.getPreviousEncounter({
          service: {
            encountersForService: [{ uuid: "UUID1" }, { uuid: "UUID2" }],
            hasEntryToday: true
          }
        }, { uuid: "UUID2" });
      expect(previousEncounter).toBeNull();
    });

  });

  describe('canSave', function () {

    it('should return true if all fields visited and all valid', function () {

      ctrl.formInfo.parts = [
        {fields: [1,2,3]}
      ];

      ctrl.addVisitedField({uuid: 1, valid: true});
      ctrl.addVisitedField({uuid: 2, valid: true});
      ctrl.addVisitedField({uuid: 3, valid: true});

      expect(ctrl.canSave()).toEqual(true);

    });

    it('should return false if not all fields visited', function () {

      ctrl.formInfo.parts = [
        {fields: [1,2,3]}
      ];

      ctrl.addVisitedField({uuid: 1, valid: true});
      ctrl.addVisitedField({uuid: 3, valid: true});

      expect(ctrl.canSave()).toEqual(false);

    });

    it('should return false if not all fields valid', function () {

      ctrl.formInfo.parts = [
        {fields: [1,2,3]}
      ];

      ctrl.addVisitedField({uuid: 1, valid: true});
      ctrl.addVisitedField({uuid: 2, valid: false});
      ctrl.addVisitedField({uuid: 3, valid: true});

      expect(ctrl.canSave()).toEqual(false);

    });

  });
});
