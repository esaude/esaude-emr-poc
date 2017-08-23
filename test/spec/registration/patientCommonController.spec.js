'use strict';

describe('PatientCommonController', function () {

  var controller, $controller, $http, patientAttributeService, patientService, localStorageService, $q, $rootScope;

  var identifierTypes = [1, 2, 3];

  var patientAttributes = [[1,2], [3,4]];

  beforeEach(module('registration', function ($provide, $translateProvider) {
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
  }));

  beforeEach(inject(function (_$controller_, _$httpBackend_, _patientAttributeService_, _patientService_, _localStorageService_, _$q_, _$rootScope_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      $http = _$httpBackend_;
      patientAttributeService = _patientAttributeService_;
      patientService = _patientService_;
      localStorageService = _localStorageService_;
    })
  );

  describe('activate', function () {

    var patientConfig;

    beforeEach(function () {
      patientConfig = {
        customAttributeRows: function () {
          return patientAttributes;
        }
      };

      spyOn(patientService, 'getIdentifierTypes').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(identifierTypes)
        })
      });

      controller = $controller('PatientCommonController', {
        $scope: {
          patientConfiguration: patientConfig
        },
        patientService: patientService
      });
    });

    it('should load patient identifier types ', function () {
      $rootScope.$apply();
      expect(controller.patientIdentifierTypes).toBe(identifierTypes);
    });

  });

  describe('create', function () {

    var identifiers;
    var patientConfig;

    beforeEach(function () {
      identifiers = [];
      patientConfig = {
        customAttributeRows: function () {
          return patientAttributes;
        }
      };

      localStorageService = {
        cookie: {
          get: function () {
            return { uuid: 'xpto'};
          }
        }
      };

      controller = $controller('PatientCommonController', {
        $scope: {
          patientConfiguration: patientConfig,
          patient: {identifiers: identifiers}
        },
        localStorageService: localStorageService
      });
    });

    it('should create a new blank identifier', function () {
      controller.addNewIdentifier();

      expect(controller.patient.identifiers.length).toBe(1);
      expect(controller.patient.identifiers[0].identifierType).not.toBeDefined();
      expect(controller.patient.identifiers[0].fieldName.length).toBe(9);
    });

  });
});
