describe('patientConfirmStep', () => {

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

    beforeEach(() => {
      spyOn(configurationService, 'getAddressLevels').and.callFake(() => $q.resolve([
        {name: "Pais", addressField: "country", required: true},
        {name: "Provincia", addressField: "stateProvince", required: true}
      ]));

      spyOn(patientService, 'getPersonAttributesForStep').and.returnValue([1,2,3,4]);
    });

    it('should load addressLevels', () => {

      var patientWizard = jasmine.createSpyObj('patientWizard', ['setCurrentStep']);
      var ctrl = $componentController('patientConfirmStep', null, {patientWizard: patientWizard});

      ctrl.$onInit();

      $rootScope.$apply();

      expect(ctrl.addressLevels).toEqual([
        {name: "Pais", addressField: "country", required: true},
        {name: "Provincia", addressField: "stateProvince", required: true}
      ]);
    });

    it('should get person attributes for testing step', () => {

      var patientWizard = jasmine.createSpyObj('patientWizard', ['setCurrentStep']);
      var ctrl = $componentController('patientConfirmStep', null, {patientWizard: patientWizard});

      ctrl.$onInit();

      expect(ctrl.patientAttributes).toEqual([1,2,3,4]);

    });

  });

});
