describe('Controller: DashboardController', function() {
  var scope, q, controller, location, applicationService, $window, $httpBackend, locationService;

  beforeEach(module('home'));

  beforeEach(function() {
    // mock $window
    $window = {
      location: {
        replace: jasmine.createSpy()
      }
    };

    module(function($provide) {
      $provide.value('$window', $window);
    });
  });

  beforeEach(inject(function($controller, $rootScope, _applicationService_, $q, $location, _$httpBackend_, _locationService_) {
    q = $q;
    scope = $rootScope.$new();
    controller = $controller;
    location = $location;
    applicationService = _applicationService_;
    locationService = _locationService_,
    $httpBackend = _$httpBackend_;
  }));

  it('should correctly set the list of apps on init', function() {
    var appJsonFixture = window.__fixtures__['app'];

    // mock applicationService.getApps
    spyOn(applicationService, 'getApps').and.returnValue(q.when(appJsonFixture));

    // mock locationService.get
    spyOn(locationService, 'get').and.callFake(function() {
      return {
        success: function(callback) {
          var data = window.__fixtures__['defaultLocationSetting'].results[0];
          callback(data);
        }
      };
    });

    // construct controller
    controller('DashboardController', {
      $scope: scope,
      applicationService: applicationService
    });

    // mock backend & ensure it gets called
    $httpBackend.expectGET("/poc_config/openmrs/i18n/common/locale_en.json")
      .respond({
        data: window.__fixtures__['local_en']
      });

    // mock backend & ensure it gets called
    $httpBackend.expectGET("/openmrs/ws/rest/v1/systemsetting?q=default_location&v=full")
      .respond({
        data: 'CS Chitima'
      });

    scope.$apply();

    expect(applicationService.getApps).toHaveBeenCalled();
    expect(scope.apps).toEqual(appJsonFixture);
  });

  it('should correctly set the chart data', function() {
    var chartDataFixture = window.__fixtures__['chartData'];

    // construct controller
    controller('DashboardController', {
      $scope: scope,
      applicationService: applicationService
    });

    expect(scope.barLabels).toEqual(chartDataFixture.barLabels);
    expect(scope.barSeries).toEqual(chartDataFixture.barSeries);
    expect(scope.barData).toEqual(chartDataFixture.barData);
    expect(scope.pieLabels).toEqual(chartDataFixture.pieLabels);
    expect(scope.pieData).toEqual(chartDataFixture.pieData);
    expect(scope.pieSeries).toEqual(chartDataFixture.pieSeries);
  });

  it('should correctly link to app', function() {
    var appJsonFixture = window.__fixtures__['app'];

    // construct controller
    controller('DashboardController', {
      $scope: scope,
      applicationService: applicationService
    });

    scope.linkApp(appJsonFixture.applications[0].url); // navigate to the registration app

    expect($window.location.href).toEqual(appJsonFixture.applications[0].url);
  });
});
