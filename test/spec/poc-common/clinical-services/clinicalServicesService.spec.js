'use strict';

describe('clinicalServicesService', function () {

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

  beforeEach(function () {
    module('poc.common.clinicalservices', function ($stateProvider, $urlRouterProvider) {
      stateProviderMock = $stateProvider;
      spyOn(stateProviderMock, 'state').and.callFake(function () {
      });
      $urlRouterProvider.deferIntercept();
    });
  });

  beforeEach(inject(function (_$httpBackend_, _$q_, _clinicalServicesService_, _clinicalServicesFormMapper_,
                              _visitService_, _encounterService_, _$rootScope_, _patientService_) {
    $http = _$httpBackend_;
    $rootScope = _$rootScope_;
    clinicalServicesService = _clinicalServicesService_;
    $q = _$q_;
    clinicalServicesFormMapper = _clinicalServicesFormMapper_;
    visitService = _visitService_;
    encounterService = _encounterService_;
    patientService = _patientService_;
  }));

  describe('init', function () {

    var module = 'foo';
    var patient = {
      "uuid": "0000-0000",
      "gender": "F",
      age: {years: 24}
    };

    beforeEach(function () {
      $http.expectGET('/poc_config/openmrs/apps/' + module + '/clinicalServices.json').respond(clinicalServices);
      $http.expectGET('/poc_config/openmrs/apps/common/formLayout.json').respond(formLayouts);

      spyOn(patientService, 'getPatient').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(patient);
        });
      });
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

    beforeEach(function () {
      $http.expectGET('/poc_config/openmrs/apps/' + module + '/clinicalServices.json').respond(clinicalServices);
      $http.expectGET('/poc_config/openmrs/apps/common/formLayout.json').respond(formLayouts);
      spyOn(patientService, 'getPatient').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(patient);
        });
      });
      clinicalServicesService.init(module, patientUuid);
      $http.flush();
    });

    beforeEach(function () {
      spyOn(clinicalServicesFormMapper, 'map').and.returnValue({});
      spyOn(visitService, 'getTodaysVisit').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });
      spyOn(encounterService, 'getEncountersForPatientByEncounterType').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(encounters);
        });
      });
    });


    describe('there is a form entry for the service today', function () {

      beforeEach(function () {
        spyOn(Bahmni.Common.Util.DateUtil, 'diffInDaysRegardlessOfTime').and.returnValue(0);
      });

      it('should load form data from the last encounter', function () {

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

    describe('deleteService: rest call using GET method to POC module that performs the logic of voiding OBS', function () {

      var openmrsUrl = "/openmrs/ws/rest/v1/clinicalservice";
      var response = [];

      var requestDetails = {clinicalservice: "clinicalServiceUuid", encounter: "encounterUuid"};

      beforeEach(function () {
        $http.expectGET(openmrsUrl + '?clinicalservice=' + requestDetails.clinicalservice + '&encounter=' + requestDetails.encounter)
        .respond(response);
      });

      it('should call end service url in delete clinical service service', function () {
        var resolve;
        clinicalServicesService.deleteService(requestDetails.clinicalservice, requestDetails.encounter).then(function (response) {
          resolve = response;
        });

        $http.flush();
        expect(resolve).toEqual(response);
      });
    });

    afterEach(function () {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });

  describe('getCsWithEncountersForPatient', function () {

      var deferred;

      var patient = {uuid: '5dc89638-b0cd-4390-bf10-ad07ed97965b'};
      var encounterType = {uuid: "adultFolowup"}

      var representation = 'custom:(uuid,encounterDatetime,obs:(value,concept:(display,uuid,mappings:(' +
              'conceptReferenceTerm:(conceptSource:(display,uuid))))),provider:(display))';

      var encounters = [{encounterDatetime: "today", obs: [{concept:{uuid: "poc-mapping-vitals"}}]},
                        {encounterDatetime: "yesterday", obs: [{concept:{uuid: "poc-mapping-vitals"}}]}];

      var service = {markedOn: "poc-mapping-vitals"};

      beforeEach(function () {
        deferred = $q.defer();

        spyOn(visitService, 'getTodaysVisit').and.callFake(function () {
          return $q(function (resolve) {
            return resolve({});
          });
        });
        spyOn(encounterService, 'getEncountersForPatientByEncounterType').and.callFake(function () {
          return $q(function (resolve) {
            return resolve(encounters);
          });
        });
      });

      it('should get a response from getCsWithEncountersForPatient, with existing service', function () {

          var returnedValue = null;

          returnedValue = clinicalServicesService.getClinicalServiceWithEncountersForPatient(patient, service);
          deferred.resolve(returnedValue);
          $rootScope.$apply();

          expect(returnedValue).toBeDefined();
      });

      it('should get a response from getCsWithEncountersForPatient, without existing service', function () {

          var returnedValue = null;

          returnedValue = clinicalServicesService.getClinicalServiceWithEncountersForPatient(patient);
          deferred.resolve(returnedValue);
          $rootScope.$apply();

          expect(returnedValue).toBeDefined();
      });
      afterEach(function () {
        $http.verifyNoOutstandingExpectation();
        $http.verifyNoOutstandingRequest();
      });

  });

});
