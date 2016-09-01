'use strict';

describe('Registration Visit Service', function () {
    var visitService;
    var openmrsUrl = "/openmrs/ws/rest/v1/visit";
    var endVisitUrl = "/openmrs/ws/rest/v1/endVisit";
    var uuid = "9e23a1bb-0615-4066-97b6-db309c9c6447";

    var mockHttp = {
        get: jasmine.createSpy('Http get').and.returnValue({'results': [{'uuid': uuid}]}),
        post: jasmine.createSpy('Http post').and.returnValue({
            'success': function (onSuccess) {
                return {
                    'then': function (thenMethod) {
                        thenMethod()
                    },
                    'error': function (onError) {
                        onError()
                    }
                }
            }})
    };

    var offlineService = {offline: function(){}};

    beforeEach(function () {
        module('bahmni.common.domain');
        module(function ($provide) {
            Bahmni.Common.Constants.endVisitUrl = endVisitUrl;
            Bahmni.Common.Constants.visitUrl = openmrsUrl;
            $provide.value('$http', mockHttp);
            $provide.value('offlineService', offlineService);
        });

        inject(['visitService', function (visitServiceInjectted) {
            visitService = visitServiceInjectted;
        }]);
    });

    it('Should call search url in registration visit service', function () {
        var parameters = {patient: uuid, includeInactive: false, v: "custom:(uuid)"}
        var results = visitService.search(parameters);
        expect(mockHttp.get).toHaveBeenCalled();
        expect(mockHttp.get.calls.mostRecent().args[0]).toBe(openmrsUrl);
        expect(mockHttp.get.calls.mostRecent().args[1].params.patient).toBe(uuid);
        expect(mockHttp.get.calls.mostRecent().args[1].params.includeInactive).toBeFalsy();
    });

    it('Should call end visit url in registration visit service', function () {
        var results = visitService.endVisit(uuid);
        expect(mockHttp.post).toHaveBeenCalled();
        expect(mockHttp.post.calls.mostRecent().args[0]).toBe(endVisitUrl + '?visitUuid=' + uuid);
        expect(mockHttp.post.calls.mostRecent().args[1].withCredentials).toBeTruthy();
    });

  it("Should post visit details to create visit url", function () {
    var visitDetails = {patientUuid: "uuid"};

    visitService.create(visitDetails);

    expect(mockHttp.post).toHaveBeenCalled();
    expect(mockHttp.post.calls.mostRecent().args[0]).toBe(openmrsUrl);
    expect(mockHttp.post.calls.mostRecent().args[1]).toBe(visitDetails);
    expect(mockHttp.post.calls.mostRecent().args[2].withCredentials).toBeTruthy();
  });

});
