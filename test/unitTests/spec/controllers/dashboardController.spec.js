describe('DashboardController', function () {
  var $controller, $q, controller, applicationService, $rootScope, consultationService, sessionService;

  beforeEach(module('home', function ($provide, $translateProvider, $urlRouterProvider) {
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

  beforeEach(inject(function (_$controller_, _$rootScope_, _applicationService_, _$httpBackend_,
    _locationService_, _$window_, _$q_, _consultationService_, _sessionService_) {
    $q = _$q_;
    $controller = _$controller_;
    applicationService = _applicationService_;
    $rootScope = _$rootScope_;
    consultationService = _consultationService_;
    sessionService = _sessionService_;
  }));

  var apps = [1, 2, 3];

  beforeEach(function () {

    spyOn(applicationService, 'getApps').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(apps);
      });
    });

    spyOn(sessionService, 'getCurrentLocation').and.returnValue({
      name: 'Cahora Bassa',
      uuid: '7fc3f286-15b1-465e-9013-b72916f58b2d'
    });

    spyOn(consultationService, 'getWeeklyConsultationSummary').and.callFake(function () {
      return $q(function (resolve) {
        return resolve({
          startDate: moment('2017-10-31', 'YYYY-MM-DD'),
          endDate: moment('2017-11-07', 'YYYY-MM-DD'),
          summary: [
            {
              consultationDate: "2017-10-31T00:00:00.000+0200",
              patientConsultations: [
                {
                  checkInOnConsultationDate: true
                }
              ]
            },
            {
              consultationDate: "2017-11-01T00:00:00.000+0200",
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
              consultationDate: "2017-11-02T00:00:00.000+0200",
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
        return resolve({
          startDate: moment('2017-10-31', 'YYYY-MM-DD'),
          endDate: moment('2017-11-07', 'YYYY-MM-DD'),
          summary: []
        });
      })
    });

    controller = $controller('DashboardController');

  });

  it('should get the current location', function () {
    expect(sessionService.getCurrentLocation).toHaveBeenCalled();
  });

  describe('activate', function () {

    it('should correctly set the list of apps', function () {

      $rootScope.$apply();

      expect(applicationService.getApps).toHaveBeenCalled();
      expect(controller.apps).toEqual(apps);

    });

    it('should load the weekly consultation summary', function () {

      $rootScope.$apply();

      expect(consultationService.getWeeklyConsultationSummary).toHaveBeenCalled();
      expect(controller.consultationSummary.data).toEqual([[2, 1, 0, 0, 0, 0, 0],
      [4, 2, 0, 0, 0, 0, 0]]);
      expect(controller.consultationSummary.labels).toEqual(["1 Nov", "2 Nov", "3 Nov", "4 Nov", "5 Nov", "6 Nov", "7 Nov"]);

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
