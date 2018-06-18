describe('FormWizardController', () => {

  var ctrl;
  var clinicalServicesService = {
    getFormLayouts: () => { },
    getFormData: () => { }
  };
  var $q;
  var $rootScope;
  var $scope;
  var $http;
  var patientService;
  var visitService;
  var spinner = { forPromise: () => { }};
  var PATIENT_EDRISSE = { name: "Edrisse", uuid: "P001" };
  var LAST_ENCOUNTER = { encounterDateTime: null };
  var FORM_DATA = { service: { lastEncounterForService: LAST_ENCOUNTER, hasEntryToday: false } };

  beforeEach(module('poc.common.clinicalservices'));

  beforeEach(inject((_$componentController_, _$q_, _$rootScope_, _$httpBackend_, _patientService_, _visitService_) => {
    $q = _$q_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $http = _$httpBackend_;
    patientService = _patientService_;
    visitService = _visitService_;

    spyOn(clinicalServicesService, 'getFormLayouts').and.callFake(() => ({parts: []}));

    spyOn(patientService, 'getPatient').and.callFake(() => $q(resolve => resolve(PATIENT_EDRISSE)));

    spyOn(clinicalServicesService, 'getFormData').and.callFake(() => $q(resolve => resolve(FORM_DATA)));

    spyOn(visitService, 'getTodaysVisit').and.callFake(() => $q(resolve => resolve(null)));

    spyOn(spinner, 'forPromise').and.callFake(() => {
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

  describe('$onInit', () => {
    it('should load form data', () => {
      ctrl.$onInit();
      $rootScope.$apply();
      expect(ctrl.formPayload).toEqual(FORM_DATA);
    });

    it('should load the patient', () => {
      ctrl.$onInit();
      $rootScope.$apply();
      expect(ctrl.patient).toEqual(PATIENT_EDRISSE);
    });

    it('should get todays visit', () => {
      ctrl.$onInit();
      $rootScope.$apply();
      expect($scope.hasVisitToday).toBeFalsy();
    });

    it('should load previous encounter', () => {
      ctrl.$onInit();
      $rootScope.$apply();
      expect($scope.previousEncounter).not.toBeNull();
    });

  });

  describe('getPreviousEncounter', () => {
    it('previous encounter should be last encounter when no occurence of the service in the current visit', () => {
      $rootScope.$apply();
      var previousEncounter = ctrl.getPreviousEncounter(FORM_DATA, null);
      expect(previousEncounter).toEqual(LAST_ENCOUNTER);
    });

    it('previous encounter should be null when no service encounter is found with same UUID', () => {
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

    it('previous encounter should be the next to service encounter', () => {
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

    it('previous encounter should be null when there is no next encounter to service encounter', () => {
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

  describe('canSave', () => {

    it('should return true if all fields visited and all valid', () => {

      ctrl.formInfo.parts = [
        {fields: [1,2,3]}
      ];

      ctrl.addVisitedField({uuid: 1, valid: true});
      ctrl.addVisitedField({uuid: 2, valid: true});
      ctrl.addVisitedField({uuid: 3, valid: true});

      expect(ctrl.canSave()).toEqual(true);

    });

    it('should return false if not all fields visited', () => {

      ctrl.formInfo.parts = [
        {fields: [1,2,3]}
      ];

      ctrl.addVisitedField({uuid: 1, valid: true});
      ctrl.addVisitedField({uuid: 3, valid: true});

      expect(ctrl.canSave()).toEqual(false);

    });

    it('should return false if not all fields valid', () => {

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
