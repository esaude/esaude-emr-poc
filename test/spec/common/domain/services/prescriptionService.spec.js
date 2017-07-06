'use strict';

describe('prescriptionService', function () {

  var prescriptionService, encounterService, conceptService, appService, $http, $q, $log, $rootScope;

  beforeEach(module('bahmni.common.domain'));

  beforeEach(inject(function (_prescriptionService_, _encounterService_, _conceptService_, _appService_, _$q_, _$rootScope_) {
    prescriptionService = _prescriptionService_;
    encounterService = _encounterService_;
    conceptService = _conceptService_;
    appService = _appService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('getPatientPrescriptions', function () {

    var patient = {uuid: "4d499e76-618c-11e7-907b-a6006ad3dba0", age: {years: 26}};

    var encounters = [
      {
        encounterDatetime: "2017-07-03T11:43:53.000+0200",
        orders: [
          {
            action: "NEW",
            drug: {
              display: "Efavirenz (efv) 50mg 30caps (embalagem)",
              uuid: "aaaafe5a-0dd7-4543-a10f-c51cda6bb1b0"
            },
            dose: 50,
            doseUnits: {
              uuid: "9d68ef86-10e8-11e5-9009-0242ac110012"
            },
            frequency: {
              display: "Once a day",
              uuid: "9d714903-10e8-11e5-9009-0242ac110012"
            },
            route: {
              uuid: "9d6af026-10e8-11e5-9009-0242ac110012"
            },
            duration: 1,
            durationUnits: {
              uuid: "9d956959-10e8-11e5-9009-0242ac110012"
            },
            dosingInstructions: "9d7408af-10e8-11e5-9009-0242ac110012"
          }
        ],
        obs: [
          {
            concept: {
              display: "THERAPEUTIC LINE",
              uuid: "fdff0637-b36f-4dce-90c7-fe9f1ec586f0"
            }
          },
          {
            concept: {
              display: "PREVIOUS ANTIRETROVIRAL DRUGS USED FOR TREATMENT",
              uuid: "e1d83d4a-1d5f-11e0-b929-000c29ad1d07"
            }
          },
          {
            concept: {
              display: "POC MAPPING PRESCRIPTION DATE",
              uuid: "488e6803-c7db-43b2-8911-8d5d2a8472fd"
            }
          }
        ]
      }
    ];

    var drugPrescriptionConvSet = [
      {
        display: "dosingUnits",
        answers: [
          {display: "ml", uuid: "9d68af32-10e8-11e5-9009-0242ac110012"},
          {display: "mg", uuid: "9d68ef86-10e8-11e5-9009-0242ac110012"}
        ],
        uuid: "9d66a447-10e8-11e5-9009-0242ac110012"
      },
      {
        display: "drugRoute",
        answers: [
          {display: "Intramuscular", uuid: "9d6af026-10e8-11e5-9009-0242ac110012"},
          {display: "Topical", uuid: "1e4f068f-10f5-11e5-9009-0242ac110012"}
        ],
        uuid: "9d6a9238-10e8-11e5-9009-0242ac110012"
      },
      {
        display: "durationUnits",
        answers: [
          {display: "Minute(s)", uuid: "1e5705ee-10f5-11e5-9009-0242ac110012"},
          {display: "Month (s)", uuid: "9d956959-10e8-11e5-9009-0242ac110012"}
        ],
        uuid: "9d6f0bea-10e8-11e5-9009-0242ac110012"
      },
      {
        display: "dosingInstructions",
        answers: [
          {display: "Before meals", uuid: "9d7408af-10e8-11e5-9009-0242ac110012"},
          {display: "Empty stomach", uuid: "9d744e5a-10e8-11e5-9009-0242ac110012"}
        ],
        uuid: "9d73c2a7-10e8-11e5-9009-0242ac110012"
      },
      {
        display: "artPlan",
        answers: [
          {display: "START DRUGS", uuid: "e1d9ef28-1d5f-11e0-b929-000c29ad1d07"},
          {display: "STOP ALL", uuid: "e1d9f36a-1d5f-11e0-b929-000c29ad1d07"}
        ],
        uuid: "e1d9ee10-1d5f-11e0-b929-000c29ad1d07"
      },
      {
        display: "interruptedReason",
        answers: [
          {display: "TOXICITY, DRUG", uuid: "e1cf3b32-1d5f-11e0-b929-000c29ad1d07"},
          {display: "OTHER NON-CODED", uuid: "e1e783ea-1d5f-11e0-b929-000c29ad1d07"}
        ],
        uuid: "e1d9ead2-1d5f-11e0-b929-000c29ad1d07"
      },
      {
        display: "changeReason",
        answers: [
          {display: "LACK OF INITIAL EFFECTIVENESS", uuid: "e1de8560-1d5f-11e0-b929-000c29ad1d07"},
          {display: "IMMUNOLOGICAL FAILURE OF ARV TREATMENT", uuid: "e1de8768-1d5f-11e0-b929-000c29ad1d07"}
        ],
        uuid: "e1de8862-1d5f-11e0-b929-000c29ad1d07"
      }
    ];

    beforeEach(function () {
      spyOn(encounterService, 'getPatientAdultFollowupEncounters').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(encounters);
        })
      });

      spyOn(conceptService, 'getPrescriptionConvSetConcept').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(drugPrescriptionConvSet)
        });
      });

      spyOn(appService, 'getAppDescriptor').and.returnValue({
        getDrugMapping: function () {
          return [{
            arvDrugs: {}
          }];
        }
      });
    });

    it('should get the patient prescriptions', function () {

      var loadedPrescriptions = {};

      prescriptionService.getPatientPrescriptions(patient).then(function (prescriptions) {
        loadedPrescriptions = prescriptions;
      });

      $rootScope.$apply();
      expect(loadedPrescriptions.encounterOrders.length).toBe(encounters.length);

      var encounterOrder = loadedPrescriptions.encounterOrders[0];
      expect(encounterOrder.orders.length).toBe(encounters[0].orders.length);

      var order = encounterOrder.orders[0];
      expect(order.doseAmount).toBe(50);
      expect(order.dosgeFrequency.display).toBe('Once a day');
      expect(order.dosingInstructions.display).toBe('Before meals');
      expect(order.dosingUnits.display).toBe('mg');
      expect(order.drug.display).toBe('Efavirenz (efv) 50mg 30caps (embalagem)');
      expect(order.drugRoute.display).toBe('Intramuscular');
      expect(order.duration).toBe(1);
      expect(order.durationUnits.display).toBe('Month (s)');

      expect(loadedPrescriptions.todaysEncounter).toBeUndefined();
      expect(loadedPrescriptions.hasServiceToday).toBeFalsy();
      expect(loadedPrescriptions.hasEntryToday).toBeFalsy();

    });

    describe('last followup encounter was today', function () {

      beforeEach(function () {
        spyOn(Bahmni.Common.Util.DateUtil, 'diffInDaysRegardlessOfTime').and.returnValue(0);
      });

      it('should signal that there was followup encounter', function () {

        var loadedPrescriptions = {};

        prescriptionService.getPatientPrescriptions(patient).then(function (prescriptions) {
          loadedPrescriptions = prescriptions;
        });

        $rootScope.$apply();
        expect(loadedPrescriptions.encounterOrders.length).toBe(encounters.length);

        var encounterOrder = loadedPrescriptions.encounterOrders[0];
        expect(encounterOrder.orders.length).toBe(encounters[0].orders.length);

        var order = encounterOrder.orders[0];
        expect(order.doseAmount).toBe(50);
        expect(order.dosgeFrequency.display).toBe('Once a day');
        expect(order.dosingInstructions.display).toBe('Before meals');
        expect(order.dosingUnits.display).toBe('mg');
        expect(order.drug.display).toBe('Efavirenz (efv) 50mg 30caps (embalagem)');
        expect(order.drugRoute.display).toBe('Intramuscular');
        expect(order.duration).toBe(1);
        expect(order.durationUnits.display).toBe('Month (s)');

        expect(loadedPrescriptions.todaysEncounter).toEqual(encounters[0]);
        expect(loadedPrescriptions.hasServiceToday).toBe(true);
        expect(loadedPrescriptions.hasEntryToday).toBe(true);

      });

    });

    xdescribe('prescription drug is ARV', function () {

    });

  });

});
