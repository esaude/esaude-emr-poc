'use strict';

describe('LocationService', function () {

  var locationService, $httpBackend;

  var locationUuids = ['location1', 'location2'];

  var cs_macomia = {
    uuid: "01a22475-d236-4416-a9a9-d8aa262e4bf6",
    display: "CS  Macomia",
    attributes: [
      {
        value: "1020612",
        attributeType: {
          uuid: "132895aa-1c88-11e8-b6fd-7395830b63f3",
          display: "Health Facility Code"
        }
      }
    ]
  };

  beforeEach(module('bahmni.common.domain'));
  beforeEach(inject(function (_$httpBackend_, _locationService_) {
    $httpBackend = _$httpBackend_;
    locationService = _locationService_;
  }));


  describe('getAllByTag', function () {

    it('should get locations by tag', function() {

      $httpBackend.expectGET('/openmrs/ws/rest/v1/location?q=foo&s=byTags').respond({results: [1,2,3,4]});

      var results;
      locationService.getAllByTag('foo').then(function (locations) {
        results = locations;
      });

      $httpBackend.flush();
      expect(results).toEqual([1,2,3,4]);
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('getLocationsByName', function () {

    var representation = 'custom:uuid,display,attributes:(value,attributeType:(uuid,display))';

    it('should get locations by name', function(){
      $httpBackend.expectGET('/openmrs/ws/rest/v1/location?q=foo&v=' + representation).respond({results: [cs_macomia]});

      var results;
      locationService.getLocationsByName('foo').then(function (locations) {
        results = locations;
      });

      $httpBackend.flush();
      expect(results.length).toEqual(1);
      expect(results[0].uuid).toEqual(cs_macomia.uuid);
    });

    it('should set the code property on each loaded location', function () {
      $httpBackend.expectGET('/openmrs/ws/rest/v1/location?q=foo&v=' + representation).respond({results: [cs_macomia]});

      var results;
      locationService.getLocationsByName('foo').then(function (locations) {
        results = locations;
      });

      $httpBackend.flush();
      expect(results[0].code).toEqual('1020612');

    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

});
