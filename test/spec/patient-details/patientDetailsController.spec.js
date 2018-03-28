'use strict';

describe('DetailPatientController', function () {

  var controller, $controller, $http, patientService, $q,
    $rootScope, reportService;

  var patientAttributes =
          [
            {"uuid":"46e79fce-ba89-4ec9-8f31-2dfd9318d415","name":"Data do teste HIV","format":"org.openmrs.util.AttributableDate","answers":[],"required":false},
            {"uuid":"ce778a93-66f9-4607-9d80-8794ed127674","name":"Tipo de teste HIV","format":"org.openmrs.Concept",
            "answers":
            [
              {"description":"PCR EXAME/TESTE","conceptId":"e1d7f61e-1d5f-11e0-b929-000c29ad1d07"},
              {"description":"SERIOLOGIA HIV DATA RESULTADO","conceptId":"e1d800dc-1d5f-11e0-b929-000c29ad1d07"}
            ],"required":false}
          ]


  beforeEach(module('patient.details', function ($provide, $translateProvider, $urlRouterProvider) {
    // Mock initialization
    $provide.factory('initialization', function () {
    });
    // Mock appService
    var appService = jasmine.createSpyObj('appService', ['initApp']);
    appService.initApp.and.returnValue({
      then: function (fn) {
      }
    });
    $provide.value('appService', appService);
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject(function (_$controller_, _$httpBackend_, _patientService_, _$q_, _$rootScope_, _reportService_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    $controller = _$controller_;
    $http = _$httpBackend_;
    patientService = _patientService_;
    reportService = _reportService_;
  }));


  describe('attributes for current step', function () {
    var patientConfig;

    beforeEach(function () {
      patientConfig = {
        customAttributeRows: function () {
          return patientAttributes;
        }
      };

      controller = $controller('DetailPatientController', {
        $scope: {
          patientConfiguration: patientConfig
        },
        patientService: patientService
      });
    });

    it('should filter person attributes for step details', function () {

      var testingAttrs = [
                  {"name": "Data do teste HIV", "uuid": "46e79fce-ba89-4ec9-8f31-2dfd9318d415"},
                  {"name": "Tipo de teste HIV", "uuid": "ce778a93-66f9-4607-9d80-8794ed127674"}  
              ]

      var filteredAttrs = controller.filterPersonAttributesForDetails(patientAttributes, testingAttrs);
      expect(filteredAttrs.length).toEqual(2);
      expect(filteredAttrs[0].name).toEqual("Data do teste HIV");

    });

  });

});
