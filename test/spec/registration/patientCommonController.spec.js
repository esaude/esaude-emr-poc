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

  describe('attributes for current step', function () {

      it('should filter person attributes for step config', function () {

        var testingAttrs = [
                    {"name": "Data do teste HIV", "uuid": "46e79fce-ba89-4ec9-8f31-2dfd9318d415"},
                    {"name": "Tipo de teste HIV", "uuid": "ce778a93-66f9-4607-9d80-8794ed127674"}  
                ]

        var personAttributes = [
          [
            {"uuid":"d10628a7-ba75-4495-840b-bf6f1c44fd2d","name":"Proveniência","format":"org.openmrs.Concept",
            "answers":
            [
              {"description":"INTERNAMENTO","conceptId":"e1dca3ee-1d5f-11e0-b929-000c29ad1d07"},
              {"description":"CLINICA MOVEL","conceptId":"e1daca74-1d5f-11e0-b929-000c29ad1d07"},
              {"description":"PROVEDOR PRIVADO","conceptId":"e1dca7ea-1d5f-11e0-b929-000c29ad1d07"},
              {"description":"PREVENCAO DE TRANSMISSAO VERTICAL","conceptId":"e1dca6e6-1d5f-11e0-b929-000c29ad1d07"},
              {"description":"PLANO NACIONAL PARA COMBATE TUBERCULOSE","conceptId":"e1daea2c-1d5f-11e0-b929-000c29ad1d07"},
              {"description":"CONSULTA EXTERNA","conceptId":"e1dca4e8-1d5f-11e0-b929-000c29ad1d07"},
              {"description":"LABORATORIO","conceptId":"e1dacb78-1d5f-11e0-b929-000c29ad1d07"},
              {"description":"ACONSELHAMENTO E TESTAGEM DE SAUDE","conceptId":"e1dca5e2-1d5f-11e0-b929-000c29ad1d07"},
              {"description":"OUTRO, NAO CODIFICADO","conceptId":"e1e783ea-1d5f-11e0-b929-000c29ad1d07"},
              {"description":"HOSPITAL DO DIA","conceptId":"e1de8d4e-1d5f-11e0-b929-000c29ad1d07"},
              {"description":"ORGANIZACAO DE BASE COMUNITARIA","conceptId":"c983ffa9-82e1-4929-8dbb-5ef9a9509679"}
            ],"required":false},
            {"uuid":"e944813c-11b1-49f3-b9a5-9fbbd10beec2","name":"Ponto de Referência","format":"java.lang.String","answers":[],"required":false}
          ],
          [
            {"uuid":"e2e3fd64-1d5f-11e0-b929-000c29ad1d07","name":"Numero de Telefone 1","format":"java.lang.String","answers":[],"required":false},
            {"uuid":"e6c97a9d-a77b-401f-b06e-81900e21ed1d","name":"Numero de Telefone 2","format":"java.lang.String","answers":[],"required":false}
          ],
          [
            {"uuid":"46e79fce-ba89-4ec9-8f31-2dfd9318d415","name":"Data do teste HIV","format":"org.openmrs.util.AttributableDate","answers":[],"required":false},
            {"uuid":"ce778a93-66f9-4607-9d80-8794ed127674","name":"Tipo de teste HIV","format":"org.openmrs.Concept",
            "answers":
            [
              {"description":"PCR EXAME/TESTE","conceptId":"e1d7f61e-1d5f-11e0-b929-000c29ad1d07"},
              {"description":"SERIOLOGIA HIV DATA RESULTADO","conceptId":"e1d800dc-1d5f-11e0-b929-000c29ad1d07"}
            ],"required":false}],
          [{"uuid":"5719d315-dbe7-4da0-bf90-466f09b5b777","name":"Alcunha","format":"java.lang.String","answers":[],"required":false}]
        ]

        var filteredAttrs = controller.filterPersonAttributesForCurrStep(personAttributes, testingAttrs);
        expect(filteredAttrs.length).toEqual(2);
        expect(filteredAttrs[0].name).toEqual("Data do teste HIV");

        controller.filterPersonAttributesForDetails(filteredAttrs, testingAttrs);


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
