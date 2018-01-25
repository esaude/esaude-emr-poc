'use strict';

describe('LocationService', function () {

  var locationService, $httpBackend;

  var locationUuids = ['location1', 'location2'];

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

    it('should get locations by name', function(){
      $httpBackend.expectGET('/openmrs/ws/rest/v1/location?q=foo').respond({results: [1,2,3,4]});

      var results;
      locationService.getLocationsByName('foo').then(function (locations) {
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

});
