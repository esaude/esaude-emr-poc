describe('sexualPartnersService', function () {

  var $q, $rootScope, service, conceptService, encounterService, observationsService, visitService;

  beforeEach(module('social', function ($provide, $translateProvider, $urlRouterProvider) {
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

  beforeEach(inject(function (_$q_, _$rootScope_, _sexualPartnersService_, _conceptService_, _encounterService_,
                              _observationsService_, _visitService_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    service = _sexualPartnersService_;
    conceptService = _conceptService_;
    encounterService = _encounterService_;
    observationsService = _observationsService_;
    visitService = _visitService_;
  }));

  describe('getFormData', function () {

    it('should load relationship to patient concept', function () {

      spyOn(conceptService, 'getConcept').and.callFake(function () {
        return $q(function (resolve) {
          return resolve();
        });
      });

      service.getFormData();

      expect(conceptService.getConcept).toHaveBeenCalledWith('e13e172c-9f49-4bd0-a976-b0c167f47918');

    });

    it('should load hiv status concept', function () {

      spyOn(conceptService, 'getConcept').and.callFake(function () {
        return $q(function (resolve) {
          return resolve();
        });
      });

      service.getFormData();

      expect(conceptService.getConcept).toHaveBeenCalledWith('e1db0cf0-1d5f-11e0-b929-000c29ad1d07');

    });

  });

  describe('getSexualPartners', function () {

    it('should load Sexual Partner encounters', function () {

      spyOn(encounterService, 'getEncountersForPatientByEncounterType').and.callFake(function () {
        return $q(function (resolve) {
          return resolve([encounter]);
        });
      });

      service.getSexualPartners({uuid: '98288a2a-8c08-4deb-bb66-a111f1018de5'});

      expect(encounterService.getEncountersForPatientByEncounterType).toHaveBeenCalled();

    });

    it('should resolve sexual partners', function () {

      spyOn(encounterService, 'getEncountersForPatientByEncounterType').and.callFake(function () {
        return $q(function (resolve) {
          return resolve([encounter]);
        });
      });

      var partners = [];
      service.getSexualPartners({uuid: '98288a2a-8c08-4deb-bb66-a111f1018de5'}).then(function (loaded) {
        partners = loaded;
      });

      $rootScope.$apply();

      expect(partners.length).toEqual(1);
      expect(partners[0].name).toEqual('Dominga Derouen');
      expect(partners[0].relationship.display).toEqual('PARCEIRO');
      expect(partners[0].hivStatus.display).toEqual('SEM INFORMACAO');

    })

  });

  describe('removeSexualPartner', function () {

    it('should delete sexual partner observation', function () {

      spyOn(observationsService, 'deleteObs');

      service.removeSexualPartner();

      expect(observationsService.deleteObs).toHaveBeenCalled();

    });

  });

  describe('saveSexualPartner', function () {
    describe('first Sexual Partner encounter from visit', function () {

      it('should create an encounter with obs', function () {

        spyOn(visitService, 'getTodaysVisit').and.callFake(function () {
          return $q(function (resolve) {
            return resolve({encounters:[]});
          })
        });

        spyOn(encounterService, 'create').and.callFake(function () {
          return $q(function (resolve) {
            return resolve({obs: [{uuid: '1063cbd9-df94-45df-becb-e30d15c13f52'}]});
          })
        });

        service.saveSexualPartner({uuid: '98288a2a-8c08-4deb-bb66-a111f1018de5'}, {
          name: 'Dominga Derouen',
          relationship: {uuid: 'e1df78b2-1d5f-11e0-b929-000c29ad1d07'},
          hivStatus: {uuid: 'e1dbff8e-1d5f-11e0-b929-000c29ad1d07'}
        });

        $rootScope.$apply();


      });

    });

    describe('existing Sexual Partner encounter from visit', function () {


      it('should create an obs for the existing encounter', function () {

        spyOn(visitService, 'getTodaysVisit').and.callFake(function () {
          return $q(function (resolve) {
            return resolve({encounters:[{encounterType:{uuid:'fc72477b-90a5-4222-a43d-efe10f0ad342'}, voided: false}]});
          })
        });

        spyOn(observationsService, 'createObs').and.callFake(function () {
          return $q(function (resolve) {
            return resolve({})
          });
        });

        service.saveSexualPartner({uuid: '98288a2a-8c08-4deb-bb66-a111f1018de5'}, {
          name: 'Dominga Derouen',
          relationship: {uuid: 'e1df78b2-1d5f-11e0-b929-000c29ad1d07'},
          hivStatus: {uuid: 'e1dbff8e-1d5f-11e0-b929-000c29ad1d07'}
        });

        $rootScope.$apply();

        expect(observationsService.createObs).toHaveBeenCalled();

      });


    });
  });


  var encounter = {
    "uuid": "18d7ef2b-cf2d-4559-a50a-7bcb9301e03c",
    "display": "S.TARV: ADULTO INICIAL A 05-04-2018",
    "obs": [
      {
        "uuid": "8d19ea83-d098-48af-a766-1b72799cbc28",
        "display": "Informação de Parceiro Sexual: PARCEIRO, SEM INFORMACAO, Dominga Derouen",
        "concept": {
          "uuid": "4cd975c4-56b8-478b-a528-d8ffb9ecd200",
          "display": "Informação de Parceiro Sexual"
        },
        "groupMembers": [
          {
            "uuid": "289a9349-5a96-4754-b1a3-0cc4e611170c",
            "display": "Relacionamento: PARCEIRO",
            "value": {
              "uuid": "e1df78b2-1d5f-11e0-b929-000c29ad1d07",
              "display": "PARCEIRO"
            },
            "concept": {
              "uuid": "e13e172c-9f49-4bd0-a976-b0c167f47918",
              "display": "Relacionamento"
            }
          },
          {
            "uuid": "a0c17ac2-9948-441a-ae86-a271ea1399bb",
            "display": "SERIOLOGIA HIV DO CONJUGE: SEM INFORMACAO",
            "value": {
              "uuid": "e1dbff8e-1d5f-11e0-b929-000c29ad1d07",
              "display": "SEM INFORMACAO"
            },
            "concept": {
              "uuid": "e1db0cf0-1d5f-11e0-b929-000c29ad1d07",
              "display": "SERIOLOGIA HIV DO CONJUGE"
            }
          },
          {
            "uuid": "4e52a511-2c31-4a7f-9530-9ab6840e447a",
            "display": "Nome do parceiro: Dominga Derouen",
            "value": "Dominga Derouen",
            "concept": {
              "uuid": "bc39b981-bde2-4486-b1b8-8cef5a3233e3",
              "display": "Nome do parceiro"
            }
          }
        ]
      }
    ]
  };

});
