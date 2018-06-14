describe('patientAddressStep', function () {

  var $componentController, configurationService, $q, $rootScope;

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

  beforeEach(inject(function (_$componentController_, _configurationService_, _$q_, _$rootScope_) {
    $componentController = _$componentController_;
    configurationService = _configurationService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('$onInit', function () {

    beforeEach(function () {
      spyOn(configurationService, 'getAddressLevels').and.callFake(function () {
        return $q.resolve([
          {name: "Pais", addressField: "country", required: true},
          {name: "Provincia", addressField: "stateProvince", required: true}
        ]);
      });
    });

    it('should load addressLevels', function () {

      var patientWizard = jasmine.createSpyObj('patientWizard', ['setCurrentStep']);
      var ctrl = $componentController('patientAddressStep', null, {patientWizard: patientWizard});

      ctrl.$onInit();

      $rootScope.$apply();

      expect(ctrl.addressLevels).toEqual([
        {name: "Pais", addressField: "country", required: true},
        {name: "Provincia", addressField: "stateProvince", required: true}
      ]);
    });

    it('should set it self as wizard current step', function () {

      var patientWizard = jasmine.createSpyObj('patientWizard', ['setCurrentStep']);
      var ctrl = $componentController('patientAddressStep', null, {patientWizard: patientWizard});

      ctrl.$onInit();

      expect(patientWizard.setCurrentStep).toHaveBeenCalledWith(ctrl);
    });

  });

});
