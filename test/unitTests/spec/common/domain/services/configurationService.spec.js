describe('configurationService', function () {

  var configurationservice, $rootScope, $httpBackend, personAttributeTypeMapper;

  beforeEach(module('bahmni.common.domain'));

  beforeEach(inject(function (_$rootScope_, _configurationService_, _$httpBackend_, _personAttributeTypeMapper_) {
    $rootScope = _$rootScope_;
    configurationservice = _configurationService_;
    $httpBackend = _$httpBackend_;
    personAttributeTypeMapper = _personAttributeTypeMapper_;
  }));

  describe('getPatientAttributeTypes', function () {

    it('should fetch person attribute types from backend', function () {

      spyOn(personAttributeTypeMapper, 'map');

      $httpBackend.expectGET('/openmrs/ws/rest/v1/personattributetype?v=full').respond({});

      configurationservice.getPatientAttributeTypes();

      $httpBackend.flush();

    });

    it('should map person attributes', function () {

      spyOn(personAttributeTypeMapper, 'map');

      $httpBackend.expectGET('/openmrs/ws/rest/v1/personattributetype?v=full').respond({});

      configurationservice.getPatientAttributeTypes();

      $httpBackend.flush();

      expect(personAttributeTypeMapper.map).toHaveBeenCalled();

    });

  });

  describe('getAddressLevels', function () {

    it('should fetch addressLevels from backend', function () {

      $httpBackend.expectGET('/openmrs/module/addresshierarchy/ajax/getOrderedAddressHierarchyLevels.form').respond({});

      configurationservice.getAddressLevels();

      $httpBackend.flush();

    });

  });

  describe('getConfigurations', function () {

    it('should fetch relationshipTypes from backend', function () {

      $httpBackend.expectGET('/openmrs/ws/rest/v1/relationshiptype?v=custom:(aIsToB,uuid)').respond([]);

      configurationservice.getConfigurations(['relationshipTypeConfig']);

      $httpBackend.flush();

    });

  });


  describe('getDefaultLocation', function () {

    it('should get default location from system settings', function () {

      $httpBackend.expectGET('').respond({results: [{value: 'Local Desconhecido'}]});

      configurationservice.getDefaultLocation();

      $httpBackend.flush();

    });

  });
});
