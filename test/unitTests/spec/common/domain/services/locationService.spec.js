'use strict';

describe('LocationService', () => {

  var locationService, $httpBackend, configurationService, $q, $rootScope;

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
  beforeEach(inject((_$httpBackend_, _locationService_, _configurationService_, _$q_, _$rootScope_) => {
    $httpBackend = _$httpBackend_;
    locationService = _locationService_;
    configurationService = _configurationService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));


  describe('getAllByTag', () => {

    it('should get locations by tag', () => {

      $httpBackend.expectGET('/openmrs/ws/rest/v1/location?q=foo&s=byTags').respond({results: [1,2,3,4]});

      var results;
      locationService.getAllByTag('foo').then(locations => {
        results = locations;
      });

      $httpBackend.flush();
      expect(results).toEqual([1,2,3,4]);
    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('getLocationsByName', () => {

    var representation = 'custom:uuid,display,attributes:(value,attributeType:(uuid,display))';

    it('should get locations by name', () => {
      $httpBackend.expectGET('/openmrs/ws/rest/v1/location?q=foo&v=' + representation).respond({results: [cs_macomia]});

      var results;
      locationService.getLocationsByName('foo').then(locations => {
        results = locations;
      });

      $httpBackend.flush();
      expect(results.length).toEqual(1);
      expect(results[0].uuid).toEqual(cs_macomia.uuid);
    });

    it('should set the code property on each loaded location', () => {
      $httpBackend.expectGET('/openmrs/ws/rest/v1/location?q=foo&v=' + representation).respond({results: [cs_macomia]});

      var results;
      locationService.getLocationsByName('foo').then(locations => {
        results = locations;
      });

      $httpBackend.flush();
      expect(results[0].code).toEqual('1020612');

    });

    afterEach(() => {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

  describe('getDefaultLocation', () => {

    it('should load default location configuration', () => {

      spyOn(configurationService, 'getDefaultLocation').and.callFake(() => $q.resolve({value: 'Local Desconhecido'}));

      locationService.getDefaultLocation();

      expect(configurationService.getDefaultLocation).toHaveBeenCalled();

    });

    it('should load default location by its name', () => {

      var representation = 'custom:uuid,display,attributes:(value,attributeType:(uuid,display))';

      $httpBackend.expectGET('/openmrs/ws/rest/v1/location?q=CS+Macomia&v=' + representation).respond({results: [cs_macomia]});

      spyOn(configurationService, 'getDefaultLocation').and.callFake(() => $q.resolve({value: 'CS Macomia'}));

      var location;
      locationService.getDefaultLocation().then(l => {
        location = l;
      });

      $rootScope.$apply();
      $httpBackend.flush();

      expect(location).toEqual({
        uuid: "01a22475-d236-4416-a9a9-d8aa262e4bf6",
        display: "CS  Macomia",
        code: "1020612",
        attributes: [
          {
            value: "1020612",
            attributeType: {
              uuid: "132895aa-1c88-11e8-b6fd-7395830b63f3",
              display: "Health Facility Code"
            }
          }
        ]
      });

    });

  });

});
