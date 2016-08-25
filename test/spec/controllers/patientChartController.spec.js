describe('Controller: PatientChartController', function() {
  var scope, q, controller, applicationService, $window,
    stateParams, $httpBackend, locationService, encounterService, observationsService;


  //TODO: Review clinic module bower dependencies invocation
  beforeEach(module('clinic'));

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

  beforeEach(inject(function($controller, $rootScope, _applicationService_, $q,
                             $stateParams, encounterService, _observationsService_) {
    q = $q;
    scope = $rootScope.$new();
    controller = $controller;
    applicationService = _applicationService_;
    stateParams = $stateParams;
    observationsService = _observationsService_;

  }));

  it('should correctly set the chart data', function() {
    var chartDataFixture = window.__fixtures__['chartData'];

    // // construct controller
    controller('PatientChartController', {
      $scope: scope,
      applicationService: applicationService
    });

    expect(chartDataFixture).toBeDefined();
  });

  it('should maintain patient value on scope', function () {
    var patient  = stateParams.patientUuid;

    //expect(patient).toBeDefined();

  });


});

