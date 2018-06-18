describe('patientDetails', () => {

  var $componentController, $q, patientService, reportService, $rootScope;

  beforeEach(module('common.patient', ($provide, $translateProvider, $urlRouterProvider) => {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', $q => () => {
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    });

    // Mock appService
    var appDescriptor = jasmine.createSpyObj('appDescriptor',['getConfigValue']);
    var appService = jasmine.createSpyObj('appService', ['getAppDescriptor', 'getPatientConfiguration']);

    appDescriptor.getConfigValue.and.returnValue({});
    appService.getAppDescriptor.and.returnValue(appDescriptor);
    appService.getPatientConfiguration.and.returnValue({personAttributeTypes: [], customAttributeRows: () => [[1, 2], [3, 4]]});

    $provide.value('appService', appService);

    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject((_$componentController_, _patientService_, _$q_, _$rootScope_, _reportService_) => {
    $componentController = _$componentController_;
    $q = _$q_;
    patientService = _patientService_;
    $rootScope = _$rootScope_;
    reportService = _reportService_;
  }));

  describe('$onInit', () => {

    beforeEach(() => {
      spyOn(patientService, 'getPatient').and.callFake(() => $q(resolve => {
        resolve({});
      }));
    });

    it('should load the patient', () => {
      var ctrl = $componentController('patientDetails');
      ctrl.$onInit();
      $rootScope.$apply();
      expect(patientService.getPatient).toHaveBeenCalled();
    });

  });

  describe('linkDashboard', () => {

    it('should navigate to dashboard', () => {
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

  describe('print', () => {

    it('should print the patient\'s daily hospital process', () => {
      spyOn(reportService,'printPatientDailyHospitalProcess').and.stub();
      var ctrl = $componentController('patientDetails');
      ctrl.print();
      expect(reportService.printPatientDailyHospitalProcess).toHaveBeenCalled();
    });

  });

});
