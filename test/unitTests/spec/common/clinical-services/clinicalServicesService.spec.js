'use strict';

describe('clinicalServicesService', () => {

  var $http, $q, stateProviderMock, clinicalServicesService, clinicalServicesFormMapper, visitService, encounterService,
    $rootScope, patientService;

  var patientUuid = "0000-0000";

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

  beforeEach(() => {
    module('poc.common.clinicalservices', ($stateProvider, $urlRouterProvider) => {
      stateProviderMock = $stateProvider;
      spyOn(stateProviderMock, 'state').and.callFake(() => {
      });
      $urlRouterProvider.deferIntercept();
    });
  });

  beforeEach(inject((_$httpBackend_, _$q_, _clinicalServicesService_, _clinicalServicesFormMapper_,
                     _visitService_, _encounterService_, _$rootScope_, _patientService_) => {
    $http = _$httpBackend_;
    $rootScope = _$rootScope_;
    clinicalServicesService = _clinicalServicesService_;
    $q = _$q_;
    clinicalServicesFormMapper = _clinicalServicesFormMapper_;
    visitService = _visitService_;
    encounterService = _encounterService_;
    patientService = _patientService_;
  }));

  describe('init', () => {

    var module = 'foo';
    var patient = {
      "uuid": "0000-0000",
      "gender": "F",
      age: {years: 24}
    };

    beforeEach(() => {
      $http.expectGET('/poc_config/openmrs/apps/' + module + '/clinicalServices.json').respond(clinicalServices);
      $http.expectGET('/poc_config/openmrs/apps/common/formLayout.json').respond(formLayouts);

      spyOn(patientService, 'getPatient').and.callFake(() => $q(resolve => resolve(patient)));
    });

    it('should load clinical services for specified module', () => {
      clinicalServicesService.init(module);
      $http.flush();
      expect();
    });

    it('should load form layouts', () => {
      clinicalServicesService.init(module);
      $http.flush();
    });

    it('should register form main state', () => {
      clinicalServicesService.init(module);
      $http.flush();

      expect(stateProviderMock.state).toHaveBeenCalledWith('anamnesis_a_adult', jasmine.objectContaining({
        url: '/anamnesis/a/adult/:serviceId/:patientUuid'
      }));
    });

    it('should register form inner states', () => {
      clinicalServicesService.init(module);
      $http.flush();

      expect(stateProviderMock.state).toHaveBeenCalledWith('anamnesis_a_adult.reference', jasmine.objectContaining({
        url: '/reference'
      }));
    });

    it('should register form confirm state', () => {
      clinicalServicesService.init(module);
      $http.flush();

      expect(stateProviderMock.state).toHaveBeenCalledWith('anamnesis_a_adult.confirm', jasmine.objectContaining({
        url: '/confirm'
      }));
    });

    it('should register form display state', () => {
      clinicalServicesService.init(module);
      $http.flush();

      expect(stateProviderMock.state).toHaveBeenCalledWith('anamnesis_a_adult_display', jasmine.objectContaining({
        url: '/anamnesis/a/adult/:serviceId/:patientUuid/display'
      }));
    });

    afterEach(() => {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });

  describe('getFormData', () => {

    var module = 'foo';

    var patient = {
      uuid: '5dc89638-b0cd-4390-bf10-ad07ed97965b',
      age: {years: 54},
      gender: 'F'
    };

    var clinicalService = clinicalServices[0];

    var representation = "custom:(description,display,encounterType,uuid,formFields:(uuid,required," +
      "field:(uuid,selectMultiple,fieldType:(display),concept:(answers,set,setMembers,uuid,datatype:(display)))))";

    var encounters = [{encounterDatetime: new Date()}, {encounterDatetime: new Date()}];

    var form = {
      encounterType: {
        uuid: 'e278f820-1d5f-11e0-b929-000c29ad1d07'
      }
    };

    var lastEncounterForService = encounters[1];

    beforeEach(() => {
      $http.expectGET('/poc_config/openmrs/apps/' + module + '/clinicalServices.json').respond(clinicalServices);
      $http.expectGET('/poc_config/openmrs/apps/common/formLayout.json').respond(formLayouts);
      spyOn(patientService, 'getPatient').and.callFake(() => $q(resolve => resolve(patient)));
      clinicalServicesService.init(module, patientUuid);
      $http.flush();
    });

    beforeEach(() => {
      spyOn(clinicalServicesFormMapper, 'map').and.returnValue({});
      spyOn(visitService, 'getTodaysVisit').and.callFake(() => $q(resolve => resolve({})));
      spyOn(encounterService, 'getEncountersForPatientByEncounterType').and.callFake(() => $q(resolve => resolve(encounters)));
    });


    describe('there is a form entry for the service today', () => {

      beforeEach(() => {
        spyOn(Bahmni.Common.Util.DateUtil, 'diffInDaysRegardlessOfTime').and.returnValue(0);
      });

      it('should load form data from the last encounter', () => {

        // Challenge: refactor clinicalServicesService.getFormData to make only one call to /form endpoint!
        $http.expectGET('/openmrs/ws/rest/v1/form/' + clinicalService.formId + "?v=custom:(encounterType:(uuid))").respond(form);
        $http.expectGET('/openmrs/ws/rest/v1/form/' + clinicalService.formId + "?v=" + representation).respond(form);

        clinicalServicesService.getFormData(patient, clinicalService);

        $http.flush();
        $rootScope.$apply();
        var param = jasmine.objectContaining({form: form, formLayout: formLayouts[0]});
        expect(clinicalServicesFormMapper.map).toHaveBeenCalledWith(param, lastEncounterForService);
      });

    });

    describe('deleteService: rest call using GET method to POC module that performs the logic of voiding OBS', () => {

      var openmrsUrl = "/openmrs/ws/rest/v1/clinicalservice";
      var response = [];

      var requestDetails = {clinicalservice: "clinicalServiceUuid", encounter: "encounterUuid"};

      beforeEach(() => {
        $http.expectGET(openmrsUrl + '?clinicalservice=' + requestDetails.clinicalservice + '&encounter=' + requestDetails.encounter)
        .respond(response);
      });

      it('should call end service url in delete clinical service service', () => {
        var resolve;
        clinicalServicesService.deleteService(requestDetails.clinicalservice, requestDetails.encounter).then(response => {
          resolve = response;
        });

        $http.flush();
        expect(resolve).toEqual(response);
      });
    });

    afterEach(() => {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });

  describe('updateService: rest call using GET method to POC module that performs the logic of updating OBS wich consists in void the previous one and insert de newer', () => {

    it('should update an encounter', () => {
  
    var encounter = {uuid:  "123"};
    var openmrsUrl = "/openmrs/ws/rest/v1/clinicalservice";
    var response = [];

    $httpBackend.expectPOST(openmrsUrl, {}).respond(response);
    
    var resolve;
    clinicalServicesService.updateService("001", encounter).then(response => {
      resolve = response;
    });

    $httpBackend.flush();
    expect(resolve).toEqual(response);

    });
  });

  describe('init with contraints', () => {

    var module = 'foo';
    var patient = {
      "uuid": "0000-0000",
      "gender": "F",
      age: {years: 24}
    };

    beforeEach(() => {

      var formLayout = [{
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
            "flexNextSref": {
                "gender": {
                  "M": ".confirm",
                  "F": ".pregnancy"
              }
            },
            "constraints": {"gender": "F"},
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

      var clinicalService = [
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

      $http.expectGET('/poc_config/openmrs/apps/' + module + '/clinicalServices.json').respond(clinicalService);
      $http.expectGET('/poc_config/openmrs/apps/common/formLayout.json').respond(formLayout);

      spyOn(patientService, 'getPatient').and.callFake(() => $q(resolve => resolve(patient)));
    });

    it('should register form inner states with gender constraint', () => {
      clinicalServicesService.init(module);
      $http.flush();

      expect(stateProviderMock.state).toHaveBeenCalledWith('anamnesis_a_adult.reference', jasmine.objectContaining({
        url: '/reference'
      }));

    });

    afterEach(() => {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });







  describe('getCsWithEncountersForPatient', () => {

      var deferred;

      var patient = {uuid: '5dc89638-b0cd-4390-bf10-ad07ed97965b'};
      var encounterType = {uuid: "adultFolowup"};

      var representation = 'custom:(uuid,encounterDatetime,obs:(value,concept:(display,uuid,mappings:(' +
              'conceptReferenceTerm:(conceptSource:(display,uuid))))),provider:(display))';

      var encounters = [{encounterDatetime: "today", obs: [{concept:{uuid: "poc-mapping-vitals"}}]},
                        {encounterDatetime: "yesterday", obs: [{concept:{uuid: "poc-mapping-vitals"}}]}];

      var service = {markedOn: "poc-mapping-vitals"};

      beforeEach(() => {
        deferred = $q.defer();

        spyOn(visitService, 'getTodaysVisit').and.callFake(() => $q(resolve => resolve({})));
        spyOn(encounterService, 'getEncountersForPatientByEncounterType').and.callFake(() => $q(resolve => resolve(encounters)));
      });

      it('should get a response from getCsWithEncountersForPatient, with existing service', () => {

          var returnedValue = null;

          returnedValue = clinicalServicesService.getClinicalServiceWithEncountersForPatient(patient, service);
          deferred.resolve(returnedValue);
          $rootScope.$apply();

          expect(returnedValue).toBeDefined();
      });

      it('should get a response from getCsWithEncountersForPatient, without existing service', () => {

          var returnedValue = null;

          returnedValue = clinicalServicesService.getClinicalServiceWithEncountersForPatient(patient);
          deferred.resolve(returnedValue);
          $rootScope.$apply();

          expect(returnedValue).toBeDefined();
      });
      afterEach(() => {
        $http.verifyNoOutstandingExpectation();
        $http.verifyNoOutstandingRequest();
      });

  });

});
