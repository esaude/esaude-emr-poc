'use strict';

describe('visitService', function () {

  var visitService, $http, $log, $q, commonService;

  beforeEach(module('bahmni.common.domain'));

  beforeEach(inject(function (_visitService_, $httpBackend, _$log_, _$q_, _commonService_) {
    visitService = _visitService_;
    $http = $httpBackend;
    $log = _$log_;
    $q = _$q_;
    commonService = _commonService_;
  }));

  var openmrsUrl = "/openmrs/ws/rest/v1/visit";

  describe('search', function () {

    var uuid = "9e23a1bb-0615-4066-97b6-db309c9c6447";
    var parameters = {patient: uuid, includeInactive: false, v: "custom:(uuid)"};
    var response = {results: [1, 2, 3]};

    beforeEach(function () {
      $http.expectGET(openmrsUrl + '?patient=' + parameters.patient + '&includeInactive=' + parameters.includeInactive
        + '&v=' + parameters.v).respond(response);
    });

    it('should call search url in registration visit service', function () {
      var resolve = {};
      visitService.search(parameters).then(function (visits) {
        resolve = visits;
      });

      $http.flush();
      expect(resolve.data.results).toEqual(response.results);
    });

    afterEach(function () {
      $http.verifyNoOutstandingExpectation();
      $http.verifyNoOutstandingRequest();
    });

  });

  describe('create', function () {

    var visitDetails = {patientUuid: "uuid"};

    beforeEach(function () {
      $http.expectPOST(openmrsUrl).respond({});
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
    var response = {results: [{startDatetime: datetime, stopDatetime: datetime}]};

    beforeEach(function () {
      $http.expectGET(openmrsUrl + '?patient=' + uuid + '&v=full').respond(response);
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

});
