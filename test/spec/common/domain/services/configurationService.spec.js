'use strict';

describe('configurationService', function () {


    var _$http;
    var rootScope;
    beforeEach(module('bahmni.common.domain'));

    beforeEach(module(function ($provide) {
        _$http = jasmine.createSpyObj('$http', ['get']);
        _$http.get.and.callFake(function (url) {
            return specUtil.respondWith({data: "success"});
        });

        $provide.value('$http', _$http);
        $provide.value('$q', Q);
    }));

    var configurationservice;

    beforeEach(inject(function (_$rootScope_, _configurationService_) {
        rootScope = _$rootScope_;
        configurationservice = _configurationService_;
    }));

    it('should fetch patientAttributesConfig from backend', function () {
        configurationservice.getConfigurations(['patientAttributesConfig']);
        expect(_$http.get.calls.mostRecent().args[0]).toEqual(Bahmni.Common.Constants.personAttributeTypeUrl);
        expect(_$http.get.calls.mostRecent().args[1].params.v).toEqual("full");
    });

    it('should fetch addressLevels from backend', function () {
        configurationservice.getConfigurations(['addressLevels']);
        expect(_$http.get.calls.mostRecent().args[0]).toEqual("/openmrs/module/addresshierarchy/ajax/getOrderedAddressHierarchyLevels.form");
    });

    it('should fetch relationshipTypes from backend', function () {
        configurationservice.getConfigurations(['relationshipTypeConfig']);
        expect(_$http.get.calls.mostRecent().args[0]).toEqual(Bahmni.Common.Constants.relationshipTypesUrl);
        expect(_$http.get.calls.mostRecent().args[1].params.v).toEqual("custom:(aIsToB,uuid)");
    });
});
