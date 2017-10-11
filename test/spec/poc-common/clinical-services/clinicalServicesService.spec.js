'use strict';

describe('clinicalServicesService', function () {

  var $http, $q, stateProviderMock, clinicalServicesService, clinicalServicesFormMapper, visitService, encounterService,
    $rootScope;

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

  beforeEach(inject(function (_$httpBackend_, _$q_, _clinicalServicesService_, _clinicalServicesFormMapper_,
                              _visitService_, _encounterService_, _$rootScope_) {
    $http = _$httpBackend_;
    $rootScope = _$rootScope_;
    clinicalServicesService = _clinicalServicesService_;
    $q = _$q_;
    clinicalServicesFormMapper = _clinicalServicesFormMapper_;
    visitService = _visitService_;
    encounterService = _encounterService_;
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

  describe('getFormData', function () {

    var module = 'foo';

    var patient = {uuid: '5dc89638-b0cd-4390-bf10-ad07ed97965b'};

    var clinicalService = clinicalServices[0];

    var representation = "custom:(description,display,encounterType,uuid,formFields:(uuid,required," +
      "field:(uuid,selectMultiple,fieldType:(display),concept:(answers,set,setMembers,uuid,datatype:(display)))))";

    var response = {
      data: {
        results: [{encounterDatetime: new Date()}, {encounterDatetime: new Date()}]
      }
    };

    var form = {
      encounterType: {
        uuid: 'e278f820-1d5f-11e0-b929-000c29ad1d07'
      }
    };

    var lastEncounterForService = response.data.results[1];

    beforeEach(function () {
      $http.expectGET('/poc_config/openmrs/apps/' + module + '/clinicalServices.json').respond(clinicalServices);
      $http.expectGET('/poc_config/openmrs/apps/common/formLayout.json').respond(formLayouts);
      clinicalServicesService.init(module);
      $http.flush();
    });

    beforeEach(function () {
      spyOn(clinicalServicesFormMapper, 'mapFromOpenMRSForm').and.returnValue({});
      spyOn(visitService, 'getTodaysVisit').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });
      spyOn(encounterService, 'getEncountersForEncounterType').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(response);
        });
      });
    });


    describe('there is a form entry for the service today', function () {

      beforeEach(function () {
        spyOn(Bahmni.Common.Util.DateUtil, 'diffInDaysRegardlessOfTime').and.returnValue(0);
      });

      it('should load form data from the last encounter', function () {

        $http.expectGET('/openmrs/ws/rest/v1/form/' + clinicalService.formId).respond(form);
        $http.expectGET('/openmrs/ws/rest/v1/form/' + clinicalService.formId + "?v=" + representation).respond(form);

        clinicalServicesService.getFormData(patient, clinicalService);

        $http.flush();
        $rootScope.$apply();
        expect(clinicalServicesFormMapper.mapFromOpenMRSForm).toHaveBeenCalledWith(form, lastEncounterForService);
      });

    });

    afterEach(function () {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });

});
