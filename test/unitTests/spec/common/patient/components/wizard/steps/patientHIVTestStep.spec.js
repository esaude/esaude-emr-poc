describe('patientHIVTestStep', () => {

  var $componentController, patientService, $q, $rootScope, sessionService, configurationService;

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

  beforeEach(inject((_$componentController_, _patientService_, _$q_, _$rootScope_, _sessionService_, _configurationService_) => {
    $componentController = _$componentController_;
    patientService = _patientService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    sessionService = _sessionService_;
    configurationService = _configurationService_;
  }));

  describe('$onInit', () => {

    var patientWizard = jasmine.createSpyObj('patientWizard', ['setCurrentStep']);
    var birthdate = new Date(1991, 2, 7);
    var patient = {birthdate};

    beforeEach(() => {
      spyOn(patientService, 'getPersonAttributesForStep').and.returnValue([1,2,3,4]);
    });

    it('should set it self as wizard current step', () => {

      var ctrl = $componentController('patientHIVTestStep', null, {patientWizard, patient});

      ctrl.$onInit();

      $rootScope.$apply();

      expect(patientWizard.setCurrentStep).toHaveBeenCalledWith(ctrl);
    });

    it('should get person attributes for testing step', () => {

      var ctrl = $componentController('patientHIVTestStep', null, {patientWizard, patient});

      ctrl.$onInit();

      expect(ctrl.patientAttributes).toEqual([1,2,3,4]);

    });

    it('should limit the test date to after patient birthdate', () => {

      var ctrl = $componentController('patientHIVTestStep', null, {patientWizard, patient});

      ctrl.$onInit();

      expect(ctrl.datepickerOptions.minDate).toEqual(birthdate);

    });

    it('should limit the test date to before current date (inclusive)', () => {

      var ctrl = $componentController('patientHIVTestStep', null, {patientWizard, patient});
      var baseTime = new Date();

      jasmine.clock().mockDate(baseTime);

      ctrl.$onInit();

      expect(ctrl.datepickerOptions.maxDate).toEqual(baseTime);

    });

  });

});
