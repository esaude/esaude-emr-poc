describe('Controller: DashboardController', function () {
  var $controller, $q, controller, configurations, applicationService, locationService, localStorageService, $rootScope,
    consultationService;

  beforeEach(module('home', function ($provide, $translateProvider) {
    $provide.factory('mergeLocaleFilesService', function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
  }));

  beforeEach(inject(function (_$controller_, _$rootScope_, _applicationService_, _$httpBackend_,
                              _locationService_, _$window_, _$q_, _configurations_, _localStorageService_,
                              _consultationService_) {
    $q = _$q_;
    $controller = _$controller_;
    applicationService = _applicationService_;
    locationService = _locationService_;
    $rootScope = _$rootScope_;
    configurations = _configurations_;
    localStorageService = _localStorageService_;
    consultationService = _consultationService_;
  }));

  var apps = [1, 2, 3];

  beforeEach(function () {

    spyOn(applicationService, 'getApps').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(apps);
      });
    });

    spyOn(configurations, 'load').and.callFake(function () {
      return $q(function (resolve) {
        return resolve([]);
      });
    });

    spyOn(configurations, 'defaultLocation').and.callFake(function () {
      return {value: 'Local Desconhecido'};
    });

    spyOn(locationService, 'get').and.callFake(function () {
      return $q(function (resolve) {
        return resolve({data: {results: [{display: 'Local Desconhecido', uuid: 'uuid'}]}});
      });
    });

    spyOn(consultationService, 'getWeeklyConsultationSummary').and.callFake(function () {
      return $q(function (resolve) {
        return resolve({
          startDate: new Date('2017-10-31 00:00:00'),
          endDate: new Date('2017-11-07 00:00:00'),
          summary: [
            {
              consultationDate: "2017-10-31 00:00:00",
              patientConsultations: [
                {
                  checkInOnConsultationDate: true
                }
              ]
            },
            {
              consultationDate: "2017-11-01 00:00:00",
              patientConsultations: [
                {
                  checkInOnConsultationDate: true
                },
                {
                  checkInOnConsultationDate: true
                },
                {
                  checkInOnConsultationDate: false
                },
                {
                  checkInOnConsultationDate: false
                }
              ]
            },
            {
              consultationDate: "2017-11-02 00:00:00",
              patientConsultations: [
                {
                  checkInOnConsultationDate: true
                },
                {
                  checkInOnConsultationDate: false
                }
              ]
            }
          ]
        });
      });
    });

    spyOn(consultationService, 'getMonthlyConsultationSummary').and.callFake(function () {
      return $q(function (resolve) {
        return resolve({});
      })
    });

    localStorageService.cookie.remove = jasmine.createSpy('remove');
    localStorageService.cookie.set = jasmine.createSpy('set');

    controller = $controller('DashboardController');

  });

  describe('activate', function () {

    it('should correctly set the list of apps', function () {

      $rootScope.$apply();

      expect(applicationService.getApps).toHaveBeenCalled();
      expect(controller.apps).toEqual(apps);

    });

    it('should load and set the location in a cookie', function () {

      $rootScope.$apply();

      expect(configurations.load).toHaveBeenCalled();
      expect(configurations.defaultLocation).toHaveBeenCalled();
      expect(localStorageService.cookie.remove).toHaveBeenCalled();
      expect(localStorageService.cookie.set).toHaveBeenCalled();

    });

    it('should load the weekly consultation summary', function () {

      $rootScope.$apply();

      expect(consultationService.getWeeklyConsultationSummary).toHaveBeenCalled();
      expect(controller.consultationSummary.data).toEqual([[2,1,0,0,0,0,0],
                                                           [4,2,0,0,0,0,0]]);
      expect(controller.consultationSummary.labels).toEqual(["1 Nov","2 Nov","3 Nov","4 Nov","5 Nov","6 Nov","7 Nov"]);

    });

  });

  describe('onMonthlySummaryClick', function () {

    it('should load the weekly consultation summary', function () {

      controller.onMonthlySummaryClick();

      $rootScope.$apply();

      expect(consultationService.getMonthlyConsultationSummary).toHaveBeenCalled();

    });

  });

  describe('scheduledConsultations', function () {

    it('should return the total number of scheduled consultations', function () {

      $rootScope.$apply();

      var total = controller.scheduledConsultations();

      expect(total).toEqual(6);

    });

  });


  describe('checkedIn', function () {

    it('should return the total number of patients who checked in to scheduled consultations', function () {

      $rootScope.$apply();

      var total = controller.checkedIn();

      expect(total).toEqual(3);

    });

  });

});
