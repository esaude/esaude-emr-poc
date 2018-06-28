describe('patientOtherStep', () => {

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

    beforeEach(() => {
      spyOn(patientService, 'getPersonAttributesForStep').and.returnValue([1,2,3,4]);
    });

    it('should set it self as wizard current step', () => {

      var patientWizard = jasmine.createSpyObj('patientWizard', ['setCurrentStep']);
      var ctrl = $componentController('patientOtherStep', null, {patientWizard});

      ctrl.$onInit();

      expect(patientWizard.setCurrentStep).toHaveBeenCalledWith(ctrl);
    });

    it('should get person attributes for others step', () => {

      var patientWizard = jasmine.createSpyObj('patientWizard', ['setCurrentStep']);
      var ctrl = $componentController('patientOtherStep', null, {patientWizard});

      ctrl.$onInit();

      expect(ctrl.patientAttributes).toEqual([1,2,3,4]);

    });

  });

});
