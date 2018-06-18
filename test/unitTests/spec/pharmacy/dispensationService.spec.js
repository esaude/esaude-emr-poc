'use strict';

describe('dispensationService', () => {

  var dispensationService, $httpBackend;

  beforeEach(module('bahmni.common.domain', $provide => {
    // Mock initialization
    $provide.factory('initialization', () => {});
    // Mock appService
    var appService = jasmine.createSpyObj('appService', ['initApp']);
    appService.initApp.and.returnValue({
      then: fn => {}
    });
    $provide.value('appService', appService);
  }));

  beforeEach(inject((_dispensationService_, _$httpBackend_) => {
    dispensationService = _dispensationService_;
    $httpBackend = _$httpBackend_;
  }));

  describe('createDispensation', () => {

    it('should create dispensation', () => {
      $httpBackend.expectPOST('/openmrs/ws/rest/v1/dispensation?v=full')
        .respond({});
    });

  });
});
