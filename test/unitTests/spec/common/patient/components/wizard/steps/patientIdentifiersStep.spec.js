describe('patientIdentifiersStep', function () {

  var $componentController, patientService, $q, $rootScope, sessionService;

  beforeEach(module('common.patient', function ($provide, $translateProvider, $urlRouterProvider) {
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

  beforeEach(inject(function (_$componentController_, _patientService_, _$q_, _$rootScope_, _sessionService_) {
    $componentController = _$componentController_;
    patientService = _patientService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    sessionService = _sessionService_;
  }));

  describe('$onInit', function () {

    var identifierTypes = [1, 2, 3];

    beforeEach(function () {
      spyOn(patientService, 'getIdentifierTypes').and.callFake(function () {
        return $q.resolve(identifierTypes);
      });
    });

    it('should load patient identifier types', function () {

      var patientWizard = jasmine.createSpyObj('patientWizard', ['setCurrentStep']);
      var ctrl = $componentController('patientIdentifiersStep', null, {patientWizard: patientWizard});

      ctrl.$onInit();

      $rootScope.$apply();

      expect(ctrl.patientIdentifierTypes).toBe(identifierTypes);
    });

    it('should set it self as wizard current step', function () {

      var patientWizard = jasmine.createSpyObj('patientWizard', ['setCurrentStep']);
      var ctrl = $componentController('patientIdentifiersStep', null, {patientWizard: patientWizard});

      ctrl.$onInit();

      expect(patientWizard.setCurrentStep).toHaveBeenCalledWith(ctrl);
    });

  });

  describe('addNewIdentifier', function () {

    it('should create a new blank identifier', function () {

      spyOn(sessionService, 'getCurrentLocation').and.returnValue({uuid: ''});

      var ctrl = $componentController('patientIdentifiersStep', null, {patient: {identifiers: []}});

      ctrl.addNewIdentifier();

      expect(ctrl.patient.identifiers.length).toBe(1);
      expect(ctrl.patient.identifiers[0].identifierType).not.toBeDefined();
      expect(ctrl.patient.identifiers[0].fieldName.length).toBe(9);
    });

  });

});
