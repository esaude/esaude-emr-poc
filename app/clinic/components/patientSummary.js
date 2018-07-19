(function () {
  'use strict';

  angular.module('clinic')
    .component('patientSummary', {
      bindings: {
        patient: '<'
      },
      controller: PatientSummaryController,
      controllerAs: 'vm',
      templateUrl: '../clinic/components/patientSummary.html',
    });

  /* @ngInject */
  function PatientSummaryController($stateParams, appService, encounterService, observationsService, commonService,
                                    dateFilter, prescriptionService) {

    var vm = this;

    vm.displayLimits = [
      {id: 1, display: "All", value: -1},
      {id: 2, display: "2", value: 2},
      {id: 3, display: "4", value: 4},
      {id: 4, display: "6", value: 6},
      {id: 5, display: "12", value: 12},
      {id: 6, display: "24", value: 24}
    ];

    vm.displayLimit = _.find(vm.displayLimits, item => item.value === +appService.getAppDescriptor().getConfigValue("defaultDisplayLimit"));

    vm.$onInit = $onInit;
    vm.filterDate = filterDate;
    vm.isObject = isObject;
    vm.updateDisplayLimit = updateDisplayLimit;

    function $onInit() {
      updateDisplayLimit(vm.displayLimit);
    }

    function dropSizeToLimit(list) {
      if (_.isUndefined(list)) return;
      var size = _.size(list);

      if (vm.displayLimit.value === -1) return list;

      if (vm.displayLimit.value > size) return list;

      return _.slice(list, 0, vm.displayLimit.value);
    }

    function updateDisplayLimit() {
      initVisitHistory()
        .then(initLabResults)
        .then(initDiagnosis)
        .then(initICD10Diagnosis)
        .then(initPharmacyPickups)
        .then(initPharmacyPickupsNew)
        .then(initPrescriptions)
        .then(initAllergies)
        .then(initVitals);
    }

    function initVisitHistory() {
      return encounterService.getEncountersOfPatient(vm.patient.uuid).success(data => {
        vm.visits = dropSizeToLimit(commonService.filterGroupReverse(data));
      });
    }

    function initLabResults() {
      var labEncounterUuid = "e2790f68-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file

      return encounterService.getEncountersForEncounterType(vm.patient.uuid, labEncounterUuid, "default").then(encounters => {
        vm.labs = commonService.filterGroupReverse(encounters);
      });
    }

    function initDiagnosis() {
      var concepts = ["e1cdd38c-1d5f-11e0-b929-000c29ad1d07",
        "e1e2b07c-1d5f-11e0-b929-000c29ad1d07",
        "e1d608cc-1d5f-11e0-b929-000c29ad1d07",
        "e1e5232a-1d5f-11e0-b929-000c29ad1d07",
        "e1e529a6-1d5f-11e0-b929-000c29ad1d07",
        "e1d2984a-1d5f-11e0-b929-000c29ad1d07",
        "e1dac2ae-1d5f-11e0-b929-000c29ad1d07",
        "e1dac3da-1d5f-11e0-b929-000c29ad1d07",
        "e1dac574-1d5f-11e0-b929-000c29ad1d07",
        "e1e2530c-1d5f-11e0-b929-000c29ad1d07",
        "e1e52898-1d5f-11e0-b929-000c29ad1d07",
        "e1e29fa6-1d5f-11e0-b929-000c29ad1d07",
        "e1daf922-1d5f-11e0-b929-000c29ad1d07",
        "e1dce93a-1d5f-11e0-b929-000c29ad1d07"
      ];//TODO: create in configuration file

      return observationsService.findAll(vm.patient.uuid).success(data => {
        var filtered = observationsService.filterByList(data.results, concepts);//TODO: filter must be dome in backend system
        var ordered = _.sortBy(filtered, obs => obs.obsDatetime);
        vm.diagnosis = dropSizeToLimit(ordered);
      });
    }

    function initICD10Diagnosis() {
      var concept = "e1eb7806-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file

      return observationsService.getObs(vm.patient.uuid, concept).then(obs => {
        var filtered = commonService.filterRetired(obs);//TODO: filter must be dome in backend system
        vm.icdDiagnosis = dropSizeToLimit(filtered);
      });
    }

    function initPharmacyPickups() {
      var pharmacyEncounterUuid = "e279133c-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file

      return encounterService.getEncountersForEncounterType(vm.patient.uuid, pharmacyEncounterUuid, "default").then(encounters => {
        vm.pickups = dropSizeToLimit(commonService.filterGroupReverse(encounters));
      });
    }

    function initPharmacyPickupsNew() {
      var pharmacyEncounterTypeUuid = "18fd49b7-6c2b-4604-88db-b3eb5b3a6d5f";

      return encounterService.getEncountersForEncounterType(vm.patient.uuid, pharmacyEncounterTypeUuid).then(encounters => {
        var nonRetired = prepareDispenses(commonService.filterReverse(encounters));
        vm.newPickups = dropSizeToLimit(nonRetired);

      });
    }

    function prepareDispenses(encounters) {

      var dispenses = [];

      _.forEach(encounters, encounter => {
        var dispense = {};
        dispense.detetime = encounter.encounterDatetime;
        dispense.provider = encounter.provider;
        dispense.items = [];
        _.forEach(encounter.obs, obs => {

          if (obs.groupMembers) {
            var item = {};
            item.order = obs.groupMembers[0].order;
            item.quantity = commonService.findByMemberConcept(obs.groupMembers, "e1de2ca0-1d5f-11e0-b929-000c29ad1d07");
            item.returnDate = commonService.findByMemberConcept(obs.groupMembers, "e1e2efd8-1d5f-11e0-b929-000c29ad1d07");

            dispense.items.push(item);
          }
        });
        dispenses.push(dispense);
      });

      return dispenses;
    }

    //TODO: Remove this duplicated function
    function initPrescriptions() {
      return prescriptionService.getAllPrescriptions(vm.patient).then(patientPrescriptions => {
        vm.hasServiceToday = (hasActivePrescription(patientPrescriptions)) ? true : null;
        vm.prescriptions = patientPrescriptions.reverse();
        setPrescritpionItemStatus(vm.existingPrescriptions);
      });
    }

    //TODO: Remove this duplicated function
    function hasActivePrescription(prescriptions) {
      return _.find(prescriptions, prescription => prescription.prescriptionStatus === true);
    }

    //TODO: Remove this duplicated function
    function setPrescritpionItemStatus(prescriptions) {
      _.forEach(prescriptions, prescription => {
        _.forEach(prescription.prescriptionItems, item => {
          if (prescription.prescriptionStatus === true) {
            if ((item.drugOrder.action === 'NEW') || (item.drugOrder.action === 'REVISE')) {
              item.status = "PHARMACY_ACTIVE";
            }
            else {
              item.status = "PHARMACY_FINALIZED";
            }
          }
          else {
            item.status = "PHARMACY_FINALIZED";
          }
        });
      });
    }

    function initAllergies() {
      var concepts = ["e1e07ece-1d5f-11e0-b929-000c29ad1d07", "e1da757e-1d5f-11e0-b929-000c29ad1d07"];

      var adultFollowupEncounterUuid = "e278f956-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file
      var childFollowupEncounterUuid = "e278fce4-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file

      return encounterService.getEncountersForEncounterType(vm.patient.uuid,
        (vm.patient.age.years >= 15) ? adultFollowupEncounterUuid : childFollowupEncounterUuid, "default")
        .then(encounters => {
          vm.allergies = dropSizeToLimit(commonService.filterGroupReverseFollowupObs(concepts, encounters));

        });
    }

    function initVitals() {
      var concepts = ["e1e2e934-1d5f-11e0-b929-000c29ad1d07",
        "e1e2e826-1d5f-11e0-b929-000c29ad1d07",
        "e1da52ba-1d5f-11e0-b929-000c29ad1d07",
        "e1e2e70e-1d5f-11e0-b929-000c29ad1d07",
        "e1e2e3d0-1d5f-11e0-b929-000c29ad1d07"
      ];//TODO: create in configuration file

      var adultFollowupEncounterUuid = "e278f956-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file
      var childFollowupEncounterUuid = "e278fce4-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file

      return encounterService.getEncountersForEncounterType(vm.patient.uuid,
        (vm.patient.age.years >= 15) ? adultFollowupEncounterUuid : childFollowupEncounterUuid, "default")
        .then(encounters => {
          vm.vitals = dropSizeToLimit(commonService.filterGroupReverseFollowupObs(concepts, encounters));

        });
    }

    function isObject(value) {
      return _.isObject(value);
    }

    function filterDate(obs) {
      if (obs.concept.uuid === "892a98b2-9c98-4813-b4e5-0b434d14404d"
        || obs.concept.uuid === "e1e2efd8-1d5f-11e0-b929-000c29ad1d07") {
        return dateFilter(obs.value);
      }

      return obs.value;
    }

  }

})();
