'use strict';

describe('dispensationService', function () {

  var dispensationService, $httpBackend;

  beforeEach(module('bahmni.common.domain', function ($provide) {
    // Mock initialization
    $provide.factory('initialization', function () {});
    // Mock appService
    var appService = jasmine.createSpyObj('appService', ['initApp']);
    appService.initApp.and.returnValue({
      then: function (fn) {}
    });
    $provide.value('appService', appService);
  }));

  beforeEach(inject(function (_dispensationService_, _$httpBackend_) {
    dispensationService = _dispensationService_;
    $httpBackend = _$httpBackend_;
  }));

  describe('createDispensation', function () {

    it('should create dispensation', function () {
      $httpBackend.expectPOST('/openmrs/ws/rest/v1/dispensation?v=full')
        .respond({});
    });

  });
});
