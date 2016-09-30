describe('patientService', function () {
  var rootScope, mockBackend, patientService, scope, searchPromise;
  var spinner = jasmine.createSpyObj('spinner', ['forPromise']);
  var controller;
  var openmrsUrl = '/openmrs/';

  var mockHttp = jasmine.createSpyObj('$http', ['get']);
  mockHttp.get.and.callFake(function (param) {
    return specUtil.respondWith("success");
  });

  beforeEach(function () {
    module('common.patient');
    inject(function (_$rootScope_, _patientService_, $httpBackend) {
      rootScope = _$rootScope_;
      patientService = _patientService_;
      mockBackend = $httpBackend
    });
  });

  beforeEach(inject(function ($controller, $rootScope) {
    controller = $controller;
    rootScope = $rootScope;
    scope = $rootScope.$new();
    spinner.forPromise.and.callFake(function (param) {
      return {}
    });
    patientService = jasmine.createSpyObj('patientService', ['search']);
    patientService.search.and.callFake(function (param) {
      return specUtil.respondWith({
        data: {
          pageOfResults: [
            {uuid: "patientUuid"}
          ]
        }
      });
    });
  }));

  beforeEach(function () {
    scope = rootScope.$new();
    searchPromise = specUtil.createServicePromise('search');
    spinner = jasmine.createSpyObj('spinner', ['show', 'hide', 'forPromise']);

  });

  it("should fetch the the specific patient by name ", function () {

    //patientService.getPatient.and.returnValue({});
    //mockBackend.expectGET('openmrsUrl  "/ws/rest/v1/patient"');

    //scope.$digest();
    //expect(mockHttp.get).toHaveBeenCalled();
    scope.$apply();
    //expect(mockHttp.get.calls.mostRecent().args[0]).toBe("/openmrs/ws/rest/v1/patient/");
    //expect(patientService.getByUuid).toHaveBeenCalledWith("observationUuid");
    //expect(observationsService.getByUuid.calls.count()).toEqual(1);
  });
});
