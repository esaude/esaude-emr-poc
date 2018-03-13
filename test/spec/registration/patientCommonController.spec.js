'use strict';

describe('PatientCommonController', function () {

  var controller, $controller, $http,conceptService, patientAttributeService, patientService, localStorageService, $q,
    $rootScope, sessionService;

  var identifierTypes = [1, 2, 3];

  var patientAttributes = [[1,2], [3,4]];

  beforeEach(module('registration', function ($provide, $translateProvider, $urlRouterProvider) {
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

  beforeEach(inject(function (_$controller_, _$httpBackend_, _patientAttributeService_, _patientService_,
                              _localStorageService_, _$q_, _$rootScope_, _conceptService_, _sessionService_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    $controller = _$controller_;
    $http = _$httpBackend_;
    patientAttributeService = _patientAttributeService_;
    patientService = _patientService_;
    localStorageService = _localStorageService_;
    conceptService = _conceptService_;
    sessionService = _sessionService_;
  }));

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
          return resolve(identifierTypes);
        })
      });

      spyOn(conceptService, 'getDeathConcepts').and.callFake(function () {
        return $q(function (resolve) {
          return resolve([]);
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

    it('should load deathConcepts ', function () {
      $rootScope.$apply();
      expect(controller.deathConcepts).toEqual([]);
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

      spyOn(sessionService, 'getCurrentLocation').and.returnValue({
        uuid: "8d6c993e-c2cc-11de-8d13-0010c6dffd0f",
        display: "Local Desconhecido"
      });

      controller = $controller('PatientCommonController', {
        $scope: {
          patientConfiguration: patientConfig,
          patient: {identifiers: identifiers},
          srefPrefix: "newpatient."
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

    it('should show error message when form is not valid and the user goes to next tab', function () {
      var form = { $valid: false };
      var sref = "name";
      controller.changeTab(form, sref);
      expect(controller.showMessages).toBe(true);
    });

    it('should allow the user to go to a previous tab even when the form is invalid', function () {
      controller = $controller('PatientCommonController', {
        $scope: {
          patientConfiguration: patientConfig,
          patient: {identifiers: identifiers},
          srefPrefix: "newpatient."
        },
        localStorageService: localStorageService,
        $state: {
          current: {
            name: "newpatient.name"
          },
          go: function (sref) {
            controller.sref = sref;
          }
        }
      });
      var form = { $valid: false };
      controller.changeTab(form, "identifier");
      expect(controller.sref).toBe("newpatient.identifier");
    });

    it('should allow the user to go to a next tab when the form is valid', function () {
      controller = $controller('PatientCommonController', {
        $scope: {
          patientConfiguration: patientConfig,
          patient: {identifiers: identifiers},
          srefPrefix: "newpatient."
        },
        localStorageService: localStorageService,
        $state: {
          current: {
            name: "newpatient.identifier"
          },
          go: function (sref) {
            controller.sref = sref;
          }
        }
      });
      var form = { $valid: true };
      controller.changeTab(form, "name");
      expect(controller.sref).toBe("newpatient.name");
    });

    it('should not allow the user to jump tabs', function () {
      controller = $controller('PatientCommonController', {
        $scope: {
          patientConfiguration: patientConfig,
          patient: {identifiers: identifiers},
          srefPrefix: "newpatient."
        },
        localStorageService: localStorageService,
        $state: {
          current: {
            name: "newpatient.identifier"
          },
          go: function (sref) {
            controller.sref = sref;
          }
        }
      });
      var form = { $valid: true };
      controller.changeTab(form, "gender");
      expect(controller.sref).toBeUndefined();
    });

    it('should notify the user when jumping tabs', function () {
      controller = $controller('PatientCommonController', {
        $scope: {
          patientConfiguration: patientConfig,
          patient: {identifiers: identifiers},
          srefPrefix: "newpatient."
        },
        localStorageService: localStorageService,
        $state: {
          current: {
            name: "newpatient.identifier"
          },
          go: function (sref) {
            controller.sref = sref;
          }
        },
        notifier: {
          warning: function (title, message) {
            controller.notificationMessage = message;
          }
        }
      });
      var form = { $valid: true };
      controller.changeTab(form, "gender");
      expect(controller.notificationMessage).toBe("FOLLOW_SEQUENCE_OF_TABS");
    });

  });

});
