'use strict';

describe('visitService', () => {

  var FIRST_CONSULTATION_VISIT_TYPE_UUID = "64a510a1-fbf4-465f-acd2-cd37bc321cee";

  var FOLLOW_UP_CONSULTATION_VISIT_TYPE_UUID = "3866891d-09c5-4d98-98de-6ae7916110fa";

  var visitService, $http, $log, $q, $rootScope, commonService, sessionService, encounterService, observationsService,
    appService;

  beforeEach(module('poc.common.visit'));

  beforeEach(inject((_visitService_, $httpBackend, _$log_, _$q_, _$rootScope_, _commonService_,
                     _sessionService_, _encounterService_, _observationsService_, _appService_) => {
    visitService = _visitService_;
    $http = $httpBackend;
    $log = _$log_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    commonService = _commonService_;
    sessionService = _sessionService_;
    encounterService = _encounterService_;
    observationsService = _observationsService_;
    appService = _appService_;
  }));

  describe('search', () => {

    var uuid = "9e23a1bb-0615-4066-97b6-db309c9c6447";
    var parameters = { patient: uuid, includeInactive: false, v: "custom:(uuid)" };
    var response = { results: [1, 2, 3] };

    beforeEach(() => {
      $http.expectGET("/openmrs/ws/rest/v1/pocvisit" + '?patient=' + parameters.patient + '&includeInactive=' + parameters.includeInactive
        + '&v=' + parameters.v).respond(response);
    });

    it('should call search url in registration visit service', () => {
      var resolve = {};
      visitService.search(parameters).then(visits => {
        resolve = visits;
      });

      $http.flush();
      expect(resolve).toEqual(response.results);
    });

    afterEach(() => {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });

  describe('create', () => {

    var visitDetails = { patientUuid: "uuid" };

    beforeEach(() => {
      $http.expectPOST("/openmrs/ws/rest/v1/checkin").respond({});
    });

    it('should call end visit url', () => {
      var resolve;
      visitService.create(visitDetails).then(response => {
        resolve = response;
      });

      $http.flush();
    });

    afterEach(() => {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });

  describe('getTodaysVisit', () => {

    it('should return null when empty array is returned by back-end', () => {
      $http.expectGET("/openmrs/ws/rest/v1/pocvisit?currentDateOnly=true&mostRecentOnly=true&patient=UUID_1&v=full&voided=false")
        .respond({ results: [] });
      var foundVisit;
      visitService.getTodaysVisit("UUID_1").then(visit => {
        foundVisit = visit;
      });
      $rootScope.$apply();
      $http.flush();
      expect(foundVisit).toBeNull();
    });

    it('should return first ocurrent when visits are returned by back-end', () => {
      var visit = { patient: { uuid: "UUID_1" } };
      $http.expectGET("/openmrs/ws/rest/v1/pocvisit?currentDateOnly=true&mostRecentOnly=true&patient=UUID_1&v=full&voided=false")
        .respond({ results: [visit] });
      var foundVisit;
      visitService.getTodaysVisit("UUID_1").then(todayVisit => {
        foundVisit = todayVisit;
      });
      $rootScope.$apply();
      $http.flush();
      expect(foundVisit).toEqual(visit);
    });

    it('should reject if no patient uuid', () => {

      var err = {};

      visitService.getTodaysVisit().catch(error => {
        err = error;
      });

      $rootScope.$apply();

      expect(err).toBeUndefined();

    });

  });

  describe('checkInPatient', () => {

    var uuid = "9e23a1bb-0615-4066-97b6-db309c9c6447";
    var parameters = { patient: uuid, includeInactive: false, v: "full" };
    var csPebane = { uuid: 'e2b37662-1d5f-11e0-b929-000c29ad1d07' };

    describe('first visit', () => {

      it('should create a visit with first consultation type', () => {

        spyOn(sessionService, 'getCurrentLocation').and.callFake(() => csPebane);

        jasmine.clock().mockDate(moment('18/04/2018 10:30:00', 'DD/MM/YYYY HH:mm:ss').toDate());

        spyOn(appService, 'getAppDescriptor').and.callFake(() => {
          var spyObj = jasmine.createSpyObj('appDescriptor', ['getConfigValue']);
          spyObj.getConfigValue.and.returnValue([{ uuid: FIRST_CONSULTATION_VISIT_TYPE_UUID, occurOn: 'first' }]);
          return spyObj;
        });

        var visitData = {
          patient: uuid,
          location: csPebane.uuid
        };

        $http.expectPOST('/openmrs/ws/rest/v1/checkin', visitData).respond({});

        var created = {};
        visitService.checkInPatient({ uuid: uuid }).then(visit => {
          created = visit;
        });

        $http.flush();
      });

    });

    describe('follow-up visit', () => {

      it('should create a visit with follow-up consultation type', () => {

        spyOn(sessionService, 'getCurrentLocation').and.callFake(() => csPebane);

        jasmine.clock().mockDate(moment('18/04/2018 10:30:00', 'DD/MM/YYYY HH:mm:ss').toDate());

        var visits = [{ voided: false }];

        spyOn(appService, 'getAppDescriptor').and.callFake(() => {
          var spyObj = jasmine.createSpyObj('appDescriptor', ['getConfigValue']);
          spyObj.getConfigValue.and.returnValue([{ uuid: FOLLOW_UP_CONSULTATION_VISIT_TYPE_UUID, occurOn: 'following' }]);
          return spyObj;
        });

        var visitData = {
          patient: uuid,
          location: csPebane.uuid
        };

        $http.expectPOST('/openmrs/ws/rest/v1/checkin', visitData).respond({});

        var created = {};
        visitService.checkInPatient({ uuid: uuid }).then(visit => {
          created = visit;
        });

        $http.flush();

      });

    });

    describe('no current location', () => {

      it('should not create a visit', () => {

        spyOn(sessionService, 'getCurrentLocation').and.callFake(() => null);

        var created = {};
        visitService.checkInPatient({ uuid: uuid }).then(visit => {
          created = visit;
        });

      });

    });

    afterEach(() => {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });

  describe('getVisitHeader', () => {

    var patient = { uuid: '7401f469-60ee-4cfa-afab-c1e89e2944e4' };

    beforeEach(() => {

      spyOn(encounterService, 'getPatientFollowupEncounters').and.callFake(() => $q(resolve => resolve([])));

      spyOn(encounterService, 'getPatientPharmacyEncounters').and.callFake(() => $q(resolve => resolve([])));

      spyOn(visitService, 'getPatientLastVisit').and.callFake(() => $q(resolve => resolve(null)));

      $http.expectGET("/openmrs/ws/rest/v1/pocvisit?mostRecentOnly=true&patient=7401f469-60ee-4cfa-afab-c1e89e2944e4&v=custom:(visitType:(name),startDatetime,stopDatetime,uuid)&voided=false")
        .respond({ results: [] });

    });

    it('should load patient followup encounters', () => {

      spyOn(observationsService, 'getLastPatientObs').and.callFake(() => $q(resolve => resolve()));

      visitService.getVisitHeader(patient);

      $http.flush();
      $rootScope.$apply();

      expect(encounterService.getPatientFollowupEncounters).toHaveBeenCalled();

    });

    it('should load patient pharmacy encounters', () => {

      spyOn(observationsService, 'getLastPatientObs').and.callFake(() => $q(resolve => resolve()));

      visitService.getVisitHeader(patient);

      $http.flush();

      expect(encounterService.getPatientPharmacyEncounters).toHaveBeenCalled();

    });

    describe('patient\'s BMI', () => {

      it('should load patient last registered BMI', () => {

        var getHeight = $q(resolve => resolve({value: 181}));

        var getWeight = $q(resolve => resolve({value: 71}));

        spyOn(observationsService, 'getLastPatientObs').and.returnValues(getHeight, getWeight);

        var header;

        visitService.getVisitHeader(patient).then(visitHeader => {
          header = visitHeader;
        });

        $http.flush();
        $rootScope.$apply();

        expect(observationsService.getLastPatientObs).toHaveBeenCalledTimes(2);
        expect(header.lastBmi.value).toEqual(21.672110130948383);

      });

      describe('no vitals', () => {

        it('should return null', () => {

          spyOn(observationsService, 'getLastPatientObs').and.callFake(() => $q(resolve => resolve()));

          var header;
          visitService.getVisitHeader(patient).then(visitHeader => {
            header = visitHeader;
          });

          $http.flush();
          $rootScope.$apply();

          expect(header.lastBmi).toEqual(null);

        });

      });

    });

    it('should load the patient\'s last visit', () => {

      spyOn(observationsService, 'getLastPatientObs').and.callFake(() => $q(resolve => resolve()));

      visitService.getVisitHeader(patient);

      $http.flush();

    });

    afterEach(() => {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });


  });

  describe('deleteVisit', () => {

    beforeEach(() => {
      $http.expectDELETE("/openmrs/ws/rest/v1/pocvisit/1234?purge=true").respond(null);
    });

    it('should call end visit url in registration visit service', () => {
      visitService.deleteVisit({uuid: '1234'});
      $http.flush();
    });

    afterEach(() => {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });

});
