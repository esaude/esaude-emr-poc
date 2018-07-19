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
      var arvItem =  {drugToPickUp: 45, arv: true};
      $httpBackend.expectPOST('/openmrs/ws/rest/v1/dispensation?v=full')
        .respond({});
    });

  });

  describe('getDefaultItemQuantityToDispense', () => {

    it('should  return quantity  equal to 30 as default quantity for ARV item', () => {

      var arvItem =  {drugToPickUp: 45, arv: true};
      var quantity = dispensationService.getDefaultItemQuantityToDispense(arvItem);
      
      expect(quantity).toEqual(30);
    });

    it('should  return quantity  equal to 45 as default quantity for non ARV item', () => {

      var nonArvItem =  {drugToPickUp: 45, arv: false};
      var quantity = dispensationService.getDefaultItemQuantityToDispense(nonArvItem);
      
      expect(quantity).toEqual(45);
    });

  });

});
