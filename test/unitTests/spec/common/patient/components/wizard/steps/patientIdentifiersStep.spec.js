describe('patientIdentifiersStep', () => {

  var $componentController, patientService, $q, $rootScope, sessionService;

  beforeEach(module('common.patient', ($provide, $translateProvider, $urlRouterProvider) => {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', $q => () => {
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject((_$componentController_, _patientService_, _$q_, _$rootScope_, _sessionService_) => {
    $componentController = _$componentController_;
    patientService = _patientService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    sessionService = _sessionService_;
  }));

  describe('$onInit', () => {

    var identifierTypes = [1, 2, 3];

    beforeEach(() => {
      spyOn(patientService, 'getIdentifierTypes').and.callFake(() => $q.resolve(identifierTypes));
    });

    it('should load patient identifier types', () => {

      var patientWizard = jasmine.createSpyObj('patientWizard', ['setCurrentStep']);
      var ctrl = $componentController('patientIdentifiersStep', null, {patientWizard: patientWizard});

      ctrl.$onInit();

      $rootScope.$apply();

      expect(ctrl.patientIdentifierTypes).toBe(identifierTypes);
    });

    it('should set it self as wizard current step', () => {

      var patientWizard = jasmine.createSpyObj('patientWizard', ['setCurrentStep']);
      var ctrl = $componentController('patientIdentifiersStep', null, {patientWizard: patientWizard});

      ctrl.$onInit();

      expect(patientWizard.setCurrentStep).toHaveBeenCalledWith(ctrl);
    });

  });

  describe('addNewIdentifier', () => {

    it('should create a new blank identifier', () => {

      spyOn(sessionService, 'getCurrentLocation').and.returnValue({uuid: ''});

      var ctrl = $componentController('patientIdentifiersStep', null, {patient: {identifiers: []}});

      ctrl.addNewIdentifier();

      expect(ctrl.patient.identifiers.length).toBe(1);
      expect(ctrl.patient.identifiers[0].identifierType).not.toBeDefined();
      expect(ctrl.patient.identifiers[0].fieldName.length).toBe(9);
    });

  });

});
