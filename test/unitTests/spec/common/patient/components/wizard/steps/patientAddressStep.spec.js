describe('patientAddressStep', function () {

  var $componentController, configurationService, $q, $rootScope, addressAttributeService;

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

  beforeEach(inject(function (_$componentController_, _configurationService_, _$q_, _$rootScope_, _addressAttributeService_) {
    $componentController = _$componentController_;
    configurationService = _configurationService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    addressAttributeService = _addressAttributeService_;
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

    it('should load addressLevels and reverse the order', function () {

      var patientWizard = jasmine.createSpyObj('patientWizard', ['setCurrentStep']);
      var ctrl = $componentController('patientAddressStep', null, {patientWizard});

      ctrl.$onInit();

      $rootScope.$apply();

      expect(ctrl.addressLevels).toEqual([
        {name: "Provincia", addressField: "stateProvince", required: true},
        {name: "Pais", addressField: "country", required: true},
      ]);
    });

    it('should set it self as wizard current step', function () {

      var patientWizard = jasmine.createSpyObj('patientWizard', ['setCurrentStep']);
      var ctrl = $componentController('patientAddressStep', null, {patientWizard});

      ctrl.$onInit();

      expect(patientWizard.setCurrentStep).toHaveBeenCalledWith(ctrl);
    });

  });

  describe('addressFieldSelected', function () {

    var addressLevels = [
      {name: "Pais", addressField: "country", required: true},
      {name: "Provincia", addressField: "stateProvince", required: true}
    ];

    beforeEach(function () {
      spyOn(configurationService, 'getAddressLevels').and.callFake(function () {
        return $q.resolve(addressLevels);
      });
    });

    it('should set the values of the address hierarchy parent fields', function () {

      var patient = {address: {}};
      var patientWizard = jasmine.createSpyObj('patientWizard', ['setCurrentStep']);
      var ctrl = $componentController('patientAddressStep', null, {patient, patientWizard});

      ctrl.$onInit();

      $rootScope.$apply();

      ctrl.addressFieldSelected('stateProvince', {parent: {name: 'Moz'}});

      expect(ctrl.patient.address.country).toEqual('Moz');

    });

  });

  describe('getAddressEntryList', function () {

    it('should search in address hierarchy', function () {

      spyOn(addressAttributeService, 'search');

      var ctrl = $componentController('patientAddressStep');

      var term = 'someplace';

      var addressField = 'stateProvince';

      ctrl.getAddressEntryList(addressField, term);

      expect(addressAttributeService.search).toHaveBeenCalledWith(addressField, term);
    });

  });

  describe('clearFields', function () {

    var addressLevels = [
      {name: "Pais", addressField: "country", required: true},
      {name: "Provincia", addressField: "stateProvince", required: true}
    ];

    beforeEach(function () {
      spyOn(configurationService, 'getAddressLevels').and.callFake(function () {
        return $q.resolve(addressLevels);
      });
    });

    it('should clear address hierarchy child fields', function () {

      var patient = {address: {}};
      var patientWizard = jasmine.createSpyObj('patientWizard', ['setCurrentStep']);
      var ctrl = $componentController('patientAddressStep', null, {patient, patientWizard});

      ctrl.$onInit();

      $rootScope.$apply();

      ctrl.patient.address.stateProvince = 'Tete';

      ctrl.addressFieldSelected('stateProvince', {parent: {name: 'Moçambique'}});

      ctrl.clearFields('country');

      expect(ctrl.patient.address.stateProvince).toEqual('');

    });

  });

});
