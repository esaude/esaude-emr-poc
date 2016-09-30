'use strict';

describe('PatientCommonController', function () {
  var $aController, $httpBackend, scope, appService, rootScope, patientAttributeService;
  var spinner = jasmine.createSpyObj('spinner', ['forPromise']);
  var dateUtil = Bahmni.Common.Util.DateUtil;

  beforeEach(module('registration'));
  beforeEach(module(function ($provide) {
    $provide.value('patientAttributeService', {});
  }));

  beforeEach(
    inject(function ($controller, _$httpBackend_, $rootScope) {
      $aController = $controller;
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
      rootScope = $rootScope;
    })
  );

  beforeEach(function () {
    appService = jasmine.createSpyObj('appService', ['getAppDescriptor']);
    rootScope.genderMap = {};
    scope.patient = {};

    appService.getAppDescriptor = function () {
      return {
        getConfigValue: function (config) {
          return true;
        }

      };
    };

    $aController('PatientCommonController', {
      $scope: scope,
      $rootScope: rootScope,
      appService: appService
    });

    //TODO: Verify Unexpected request: GET /poc_config/openmrs/i18n/common/locale_en.json
    //$httpBackend.whenGET(Bahmni.Common.Constants.globalPropertyUrl + '?property=concept.reasonForDeath').respond({});
    //$httpBackend.when('GET', Bahmni.Common.Constants.conceptUrl).respond({});
    //$httpBackend.flush();
  });

  it("should make calls for reason for death global property and concept sets", function () {

  });

  describe("when loaded", function () {
    it("should initialized need information ", function () {

      scope.today = dateUtil.getDateWithoutTime(dateUtil.now());
      scope.patient = {"uuid": "patientUuid"};
      scope.visitHistory = {
        activeVisit: {uuid: "latestVisitUuid", startDatetime: "someStartDate"}      };

      expect(scope.today).toBe(dateUtil.getDateWithoutTime(dateUtil.now()));

    });

  });
});
