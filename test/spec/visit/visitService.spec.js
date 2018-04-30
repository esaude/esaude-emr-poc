'use strict';

describe('visitService', function () {

  var FIRST_CONSULTATION_VISIT_TYPE_UUID = "64a510a1-fbf4-465f-acd2-cd37bc321cee";

  var FOLLOW_UP_CONSULTATION_VISIT_TYPE_UUID = "3866891d-09c5-4d98-98de-6ae7916110fa";

  var visitService, $http, $log, $q, $rootScope, commonService, sessionService, encounterService, observationsService;

  beforeEach(module('visit'));

  beforeEach(inject(function (_visitService_, $httpBackend, _$log_, _$q_, _$rootScope_, _commonService_,
    _sessionService_, _encounterService_, _observationsService_) {
    visitService = _visitService_;
    $http = $httpBackend;
    $log = _$log_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    commonService = _commonService_;
    sessionService = _sessionService_;
    encounterService = _encounterService_;
    observationsService = _observationsService_;
  }));

  describe('search', function () {

    var uuid = "9e23a1bb-0615-4066-97b6-db309c9c6447";
    var parameters = { patient: uuid, includeInactive: false, v: "custom:(uuid)" };
    var response = { results: [1, 2, 3] };

    beforeEach(function () {
      $http.expectGET("/openmrs/ws/rest/v1/visit" + '?patient=' + parameters.patient + '&includeInactive=' + parameters.includeInactive
        + '&v=' + parameters.v).respond(response);
    });

    it('should call search url in registration visit service', function () {
      var resolve = {};
      visitService.search(parameters).then(function (visits) {
        resolve = visits;
      });

      $http.flush();
      expect(resolve).toEqual(response.results);
    });

    afterEach(function () {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });

  describe('create', function () {

    var visitDetails = { patientUuid: "uuid" };

    beforeEach(function () {
      $http.expectPOST("/openmrs/ws/rest/v1/visit").respond({});
    });

    it('should call end visit url in registration visit service', function () {
      var resolve;
      visitService.create(visitDetails).then(function (response) {
        resolve = response;
      });

      $http.flush();
    });

    afterEach(function () {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });

  describe('getTodaysVisit', function () {

    var uuid = "9e23a1bb-0615-4066-97b6-db309c9c6447";
    var datetime = '2017-08-17';
    var response = { results: [{ startDatetime: datetime, stopDatetime: datetime }] };

    beforeEach(function () {
      $http.expectGET("/openmrs/ws/rest/v1/visit" + '?patient=' + uuid + '&v=full').respond(response);
    });

    describe('last visit is today', function () {

      it('should return the patients visit', function () {

        var dateUtil = Bahmni.Common.Util.DateUtil;
        var resolve = {};

        spyOn(dateUtil, 'now').and.callFake(function () {
          return dateUtil.parseDatetime(datetime);
        });

        visitService.getTodaysVisit(uuid).then(function (todaysVisit) {
          resolve = todaysVisit;
        });

        $http.flush();
        expect(resolve).toEqual(response.results[0]);
      });

    });

    describe('last visit not today', function () {
      it('should return the patients visit', function () {

        var resolve = {};

        visitService.getTodaysVisit(uuid).then(function (todaysVisit) {
          resolve = todaysVisit;
        });

        $http.flush();
        expect(resolve).toEqual(null);
      });
    });

    afterEach(function () {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });
  });

  describe('checkInPatient', function () {

    var uuid = "9e23a1bb-0615-4066-97b6-db309c9c6447";
    var parameters = { patient: uuid, includeInactive: false, v: "full" };
    var csPebane = { uuid: 'e2b37662-1d5f-11e0-b929-000c29ad1d07' };

    describe('first visit', function () {

      it('should create a visit with first consultation type', function () {

        spyOn(sessionService, 'getCurrentLocation').and.callFake(function () {
          return csPebane;
        });

        jasmine.clock().mockDate(moment('18/04/2018 10:30:00', 'DD/MM/YYYY HH:mm:ss').toDate());

        $http.expectGET("/openmrs/ws/rest/v1/visit?patient=" + parameters.patient
          + '&v=' + parameters.v)
          .respond([]);

        var visitData = {
          patient: uuid,
          visitType: FIRST_CONSULTATION_VISIT_TYPE_UUID,
          location: csPebane.uuid,
          startDatetime: '2018-04-18T10:30:00',
          stopDatetime: '2018-04-18T23:59:59'
        };

        $http.expectPOST('/openmrs/ws/rest/v1/visit', visitData).respond({});

        var created = {};
        visitService.checkInPatient({ uuid: uuid }).then(function (visit) {
          created = visit;
        });

        $http.flush();
      });

    });

    describe('follow-up visit', function () {

      var DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

      it('should create a visit with follow-up consultation type', function () {

        spyOn(sessionService, 'getCurrentLocation').and.callFake(function () {
          return csPebane;
        });

        jasmine.clock().mockDate(moment('18/04/2018 10:30:00', 'DD/MM/YYYY HH:mm:ss').toDate());
        
        var visits = [{ voided: false }];
        $http.expectGET("/openmrs/ws/rest/v1/visit?patient=" + parameters.patient
          + '&v=' + parameters.v)
          .respond({ results: visits });

        var visitData = {
          patient: uuid,
          visitType: FOLLOW_UP_CONSULTATION_VISIT_TYPE_UUID,
          location: csPebane.uuid,
          startDatetime: '2018-04-18T10:30:00',
          stopDatetime: '2018-04-18T23:59:59'
        };

        $http.expectPOST('/openmrs/ws/rest/v1/visit', visitData).respond({});

        var created = {};
        visitService.checkInPatient({ uuid: uuid }).then(function (visit) {
          created = visit;
        });

        $http.flush();

      });

    });

    describe('no current location', function () {

      it('should not create a visit', function () {

        spyOn(sessionService, 'getCurrentLocation').and.callFake(function () {
          return null;
        });

        var visits = [{ voided: false }];
        $http.expectGET("/openmrs/ws/rest/v1/visit?patient=" + parameters.patient
          + '&v=' + parameters.v)
          .respond({ results: visits });

        var created = {};
        visitService.checkInPatient({ uuid: uuid }).then(function (visit) {
          created = visit;
        });

        $http.flush();

      });

    });

    afterEach(function () {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });

  describe('getVisitHeader', function () {

    var patient = { uuid: '7401f469-60ee-4cfa-afab-c1e89e2944e4' };

    beforeEach(function () {

      spyOn(encounterService, 'getPatientFollowupEncounters').and.callFake(function () {
        return $q(function (resolve) {
          return resolve([]);
        })
      });

      spyOn(encounterService, 'getPatientPharmacyEncounters').and.callFake(function () {
        return $q(function (resolve) {
          return resolve([]);
        })
      });

      $http.expectGET("/openmrs/ws/rest/v1/visit?patient=" + patient.uuid + '&v=custom:(visitType:(name),startDatetime,stopDatetime,uuid)')
        .respond([]);

    });

    it('should load patient followup encounters', function () {

      spyOn(observationsService, 'getLastPatientObs').and.callFake(function () {
        return $q(function (resolve) {
          return resolve();
        });
      });

      visitService.getVisitHeader(patient);

      $http.flush();

      expect(encounterService.getPatientFollowupEncounters).toHaveBeenCalled();

    });

    it('should load patient pharmacy encounters', function () {

      spyOn(observationsService, 'getLastPatientObs').and.callFake(function () {
        return $q(function (resolve) {
          return resolve();
        });
      });

      visitService.getVisitHeader(patient);

      $http.flush();

      expect(encounterService.getPatientPharmacyEncounters).toHaveBeenCalled();

    });

    describe('patient\'s BMI', function () {

      it('should load patient last registered BMI', function () {

        var getHeight = $q(function (resolve) {
          return resolve({ value: 181 });
        });

        var getWeight = $q(function (resolve) {
          return resolve({ value: 71 });
        });

        spyOn(observationsService, 'getLastPatientObs').and.returnValues(getHeight, getWeight);

        var header;

        visitService.getVisitHeader(patient).then(function (visitHeader) {
          header = visitHeader;
        });

        $http.flush();
        $rootScope.$apply();

        expect(observationsService.getLastPatientObs).toHaveBeenCalledTimes(2);
        expect(header.lastBmi.value).toEqual(21.672110130948383);

      });

      describe('no vitals', function () {

        it('should return null', function () {

          spyOn(observationsService, 'getLastPatientObs').and.callFake(function () {
            return $q(function (resolve) {
              return resolve();
            });
          });

          var header;
          visitService.getVisitHeader(patient).then(function (visitHeader) {
            header = visitHeader;
          });

          $http.flush();
          $rootScope.$apply();

          expect(header.lastBmi).toEqual(null);

        });

      });

    });

    it('should load the patient\'s last visit', function () {

      spyOn(observationsService, 'getLastPatientObs').and.callFake(function () {
        return $q(function (resolve) {
          return resolve();
        });
      });

      visitService.getVisitHeader(patient);

      $http.flush();

    });

    afterEach(function () {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });


  });

});
