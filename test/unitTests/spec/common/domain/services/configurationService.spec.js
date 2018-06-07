describe('configurationService', function () {

  var configurationservice, $rootScope, $httpBackend;

  beforeEach(module('bahmni.common.domain'));

  beforeEach(inject(function (_$rootScope_, _configurationService_, _$httpBackend_) {
    $rootScope = _$rootScope_;
    configurationservice = _configurationService_;
    $httpBackend = _$httpBackend_;
  }));

  describe('getPatientAttributeTypes', function () {

    it('should fetch patientAttributesConfig from backend', function () {

      $httpBackend.expectGET('/openmrs/ws/rest/v1/personattributetype?v=full').respond({});

      configurationservice.getPatientAttributeTypes();

      $httpBackend.flush();

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
