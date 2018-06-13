describe('PatientDetailsController', function () {

  var $componentController, $q, patientService, configurationService, reportService, $rootScope;

  beforeEach(module('patient.details', function ($provide, $translateProvider, $urlRouterProvider) {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });

    // Mock appService
    var appDescriptor = jasmine.createSpyObj('appDescriptor',['getConfigValue']);
    var appService = jasmine.createSpyObj('appService', ['getAppDescriptor', 'getPatientConfiguration']);

    appDescriptor.getConfigValue.and.returnValue({});
    appService.getAppDescriptor.and.returnValue(appDescriptor);
    appService.getPatientConfiguration.and.returnValue({personAttributeTypes: [], customAttributeRows: function () {
        return [[1, 2], [3, 4]];
      }});

    $provide.value('appService', appService);

    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject(function (_$componentController_, _patientService_, _$q_, _$rootScope_, _reportService_,
                              _configurationService_) {
    $componentController = _$componentController_;
    $q = _$q_;
    patientService = _patientService_;
    $rootScope = _$rootScope_;
    reportService = _reportService_;
    configurationService = _configurationService_;
  }));

  describe('$onInit', function () {

    beforeEach(function () {
      spyOn(patientService, 'getPatient').and.callFake(function () {
        return $q(function (resolve) {
          resolve({});
        });
      });

      spyOn(configurationService, 'getAddressLevels').and.callFake(function () {
        return $q.resolve([
          {name: "Pais", addressField: "country", required: true},
          {name: "Provincia", addressField: "stateProvince", required: true}
        ]);
      });
    });

    it('should load the patient', function () {
      var ctrl = $componentController('patientDetails');
      ctrl.$onInit();
      $rootScope.$apply();
      expect(patientService.getPatient).toHaveBeenCalled();
    });

    it('should load addressLevels', function () {
      var ctrl = $componentController('patientDetails');
      ctrl.$onInit();
      $rootScope.$apply();
      expect(ctrl.addressLevels).toEqual([
        {name: "Pais", addressField: "country", required: true},
        {name: "Provincia", addressField: "stateProvince", required: true}
      ]);
    });

  });

  describe('linkDashboard', function () {

    it('should navigate to dashboard', function () {
      var go = jasmine.createSpy('go');

      var ctrl = $componentController('patientDetails', {
        $state: {
          go: go
        },
        $stateParams: {
          patientUuid: '02be1844-761e-4722-ab1b-320fb1cbc5a6',
          returnState: 'return'
        }
      });

      ctrl.linkDashboard();

      expect(go).toHaveBeenCalledWith('return', {patientUuid: '02be1844-761e-4722-ab1b-320fb1cbc5a6'});
    });

  });

  describe('print', function () {

    it('should print the patient\'s daily hospital process', function () {
      spyOn(reportService,'printPatientDailyHospitalProcess').and.stub();
      var ctrl = $componentController('patientDetails');
      ctrl.print();
      expect(reportService.printPatientDailyHospitalProcess).toHaveBeenCalled();
    });

  });

});
