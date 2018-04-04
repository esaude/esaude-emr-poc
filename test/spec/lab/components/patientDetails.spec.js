describe('PatientDetailsController', function () {

  var $componentController, $q, patientService, patientConfiguration, reportService;

  patientConfiguration = {
    customAttributeRows: function () {
      return [[1, 2], [3, 4]];
    }
  };

  beforeEach(module('lab', function ($provide, $translateProvider, $urlRouterProvider) {
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

  beforeEach(inject(function (_$componentController_, _patientService_, _$q_, _$rootScope_, _reportService_) {
    $componentController = _$componentController_;
    $q = _$q_;
    patientService = _patientService_;
    $rootScope = _$rootScope_;
    reportService = _reportService_;
  }));

  describe('$onInit', function () {

    beforeEach(function () {
      spyOn(patientService, 'getPatient').and.callFake(function () {
        return $q(function (resolve) {
          resolve({});
        })
      });
    });

    it('should load the patient', function () {
      var ctrl = $componentController('patientDetails', {
        $rootScope: {
          patientConfiguration: patientConfiguration
        }
      });
      ctrl.$onInit();
      $rootScope.$apply();
      expect(patientService.getPatient).toHaveBeenCalled();
    });

    it('should define the patient attributes', function () {
      var ctrl = $componentController('patientDetails', {
        $rootScope: {
          patientConfiguration: patientConfiguration
        }
      });
      ctrl.$onInit();
      $rootScope.$apply();
      expect(ctrl.patientAttributes).toEqual([1, 2, 3, 4]);
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
