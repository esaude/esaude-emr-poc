describe('conceptService', function () {

  var  conceptService, appService, $http, $q, $log, $rootScope;

  beforeEach(module('bahmni.common.domain'));

  beforeEach(inject(function (_conceptService_, _appService_, _$q_, _$rootScope_,
                              _$httpBackend_) {

    conceptService = _conceptService_;
    appService = _appService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $http = _$httpBackend_;
  }));

  it('should fetch the death concept by uuid', function() {

    var query = '/openmrs/ws/rest/v1/systemsetting?q=concept.causeOfDeath&v=custom:value';

    $http.expectGET(query).respond({results:[]});

    conceptService.getDeathConcepts();

    $http.flush();
    $http.verifyNoOutstandingExpectation();
    $http.verifyNoOutstandingRequest();
  });

});
