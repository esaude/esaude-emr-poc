describe('Controller: PatientSummaryController', function() {
  var scope, q, controller,  applicationService, $window,
    stateParams, $httpBackend, locationService, encounterService, $rootScope,
    observationsService, commonService;


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
                             $stateParams, encounterService, _observationsService_,  _commonService_) {
    q = $q;
    scope = $rootScope.$new();
    controller = $controller;
    applicationService = _applicationService_;
    stateParams = $stateParams;
    observationsService = _observationsService_;
    commonService = _commonService_;

  }));

  it('should have all patient data initialized ', function() {
    var patientFixture = window.__fixtures__['patient'];

    //TODO: Refine test with spy
    // // construct controller
    controller('PatientSummaryController', {
      $scope: scope
    });



    spyOn(scope, 'initVisitHistory').and.returnValue(q.when(patientFixture));
    var visitHistory  = scope.initVisitHistory;

    // scope.$apply();
    // expect(scope.initVisitHistory).toHaveBeenCalled() ;
  });

});

