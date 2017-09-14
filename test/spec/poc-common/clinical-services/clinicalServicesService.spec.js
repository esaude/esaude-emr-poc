'use strict';

describe('clinicalServicesService', function () {

  var $http, $q, stateProviderMock, clinicalServicesService;

  var clinicalServices = [
    {
      "id": "001",
      "formId": "e28b6096-1d5f-11e0-b929-000c29ad1d07",
      "label": "COMMON_SOCIAL_INFO_FORM",
      "url": "/anamnesis/a/adult",
      "minOccur": "1",
      "maxOccur": "-1",
      "constraints": {
        "minAge": "15",
        "requireChekin": true
      },
      "privilege": "Anamnesis"
    }
  ];

  var formLayouts = [{
    "id": "001",
    "formId": "e28b6096-1d5f-11e0-b929-000c29ad1d07",
    "name": "INFO SOCIAL - ADULTO",
    "label": "COMMON_SOCIAL_INFO_FORM",
    "sufix": "anamnesis_a_adult",
    "parts": [
      {
        "id": "1",
        "name": "Pessoa de Referência",
        "label": "COMMON_CONTACT_PERSON",
        "sref": ".reference",
        "nextSref": ".extra",
        "fields": [
          {
            "name": "Nome",
            "label": "COMMON_NAME",
            "id": "e29f8ac6-1d5f-11e0-b929-000c29ad1d07"
          },
          {
            "name": "Apelido",
            "label": "COMMON_SURNAME",
            "id": "e2a0bb8a-1d5f-11e0-b929-000c29ad1d07"
          },
          {
            "name": "Tel",
            "label": "COMMON_CONTACT",
            "id": "e29f7a72-1d5f-11e0-b929-000c29ad1d07"
          }
        ]
      }
    ]
  }];

  beforeEach(function () {
    module('poc.common.clinicalservices', function ($stateProvider) {
      stateProviderMock = $stateProvider;
      spyOn(stateProviderMock, 'state').and.callFake(function () {
      });
    });
  });

  beforeEach(inject(function (_$httpBackend_, _$q_, _clinicalServicesService_) {
    $http = _$httpBackend_;
    clinicalServicesService = _clinicalServicesService_;
    $q = _$q_;
  }));

  describe('init', function () {

    var module = 'foo';

    beforeEach(function () {
      $http.expectGET('/poc_config/openmrs/apps/' + module + '/clinicalServices.json').respond(clinicalServices);
      $http.expectGET('/poc_config/openmrs/apps/common/formLayout.json').respond(formLayouts);
    });

    it('should load clinical services for specified module', function () {
      clinicalServicesService.init(module);
      $http.flush();
      expect()
    });

    it('should load form layouts', function () {
      clinicalServicesService.init(module);
      $http.flush();
    });

    it('should register form main state', function () {
      clinicalServicesService.init(module);
      $http.flush();

      expect(stateProviderMock.state).toHaveBeenCalledWith('anamnesis_a_adult', jasmine.objectContaining({
        url: '/anamnesis/a/adult/:serviceId/:patientUuid'
      }));
    });

    it('should register form inner states', function () {
      clinicalServicesService.init(module);
      $http.flush();

      expect(stateProviderMock.state).toHaveBeenCalledWith('anamnesis_a_adult.reference', jasmine.objectContaining({
        url: '/reference'
      }));
    });

    it('should register form confirm state', function () {
      clinicalServicesService.init(module);
      $http.flush();

      expect(stateProviderMock.state).toHaveBeenCalledWith('anamnesis_a_adult.confirm', jasmine.objectContaining({
        url: '/confirm'
      }));
    });

    it('should register form display state', function () {
      clinicalServicesService.init(module);
      $http.flush();

      expect(stateProviderMock.state).toHaveBeenCalledWith('anamnesis_a_adult_display', jasmine.objectContaining({
        url: '/anamnesis/a/adult/:serviceId/:patientUuid/display'
      }));
    });

    afterEach(function () {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });

});
