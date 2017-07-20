  'use strict';

    angular.module('clinic')
        .controller('PatientSummaryController', PatientSummaryController);

    PatientSummaryController.$inject = ['$rootScope', '$stateParams',
                        'encounterService', 'observationsService', 'commonService', 'orderService', '$filter'];

    function PatientSummaryController($rootScope, $stateParams, encounterService,
                    observationsService, commonService, orderService, $filter) {
        
        var patientUuid = $stateParams.patientUuid;
        var vm = this;

        vm.displayLimits = [
            {id: 1, display: "All", value: -1},
            {id: 2, display: "2", value: 2},
            {id: 3, display: "4", value: 4},
            {id: 4, display: "6", value: 6},
            {id: 5, display: "12", value: 12},
            {id: 6, display: "24", value: 24}
        ];

        vm.displayLimit = _.find(vm.displayLimits, function (item) {
            return item.value == $rootScope.defaultDisplayLimit;
        });

        vm.updateDisplayLimit = updateDisplayLimit;
        vm.initVisitHistory = initVisitHistory;
        vm.initLabResults = initLabResults;
        vm.initDiagnosis = initDiagnosis;
        vm.initICD10Diagnosis = initICD10Diagnosis;
        vm.initPharmacyPickups = initPharmacyPickups;
        vm.initPharmacyPickupsNew = initPharmacyPickupsNew;
        vm.initPrescriptions = initPrescriptions;
        vm.initAllergies = initAllergies;
        vm.initVitals = initVitals;

        var dropSizeToLimit = function (list) {
            if (_.isUndefined(list)) return;
            var size = _.size(list);

            if (vm.displayLimit.value === -1) return list;

            if (vm.displayLimit.value > size) return list;

            return _.slice(list, 0, vm.displayLimit.value);
        };

        function updateDisplayLimit(item) {
            initVisitHistory();
            initLabResults();
            initDiagnosis();
            initICD10Diagnosis();
            initPharmacyPickups();
            initPharmacyPickupsNew();
            initPrescriptions();
            initAllergies();
            initVitals();
        };

        function initVisitHistory() {
            encounterService.getEncountersOfPatient(patientUuid).success(function (data) {
          vm.visits = dropSizeToLimit(commonService.filterGroupReverse(data));
            });
        };

        function initLabResults() {
            var labEncounterUuid = "e2790f68-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file

            encounterService.getEncountersForEncounterType(patientUuid, labEncounterUuid).success(function (data) {
                vm.labs = commonService.filterGroupReverse(data);
            });
        };

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

            observationsService.findAll(patientUuid).success (function (data) {
                var filtered = observationsService.filterByList(data.results, concepts);//TODO: filter must be dome in backend system
                var ordered = _.sortBy(filtered, function (obs) {
                    return obs.obsDatetime;
                });
                vm.diagnosis = dropSizeToLimit(ordered);
            });
        };

        function initICD10Diagnosis() {
            var concept = "e1eb7806-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file

            observationsService.get(patientUuid, concept).success (function (data) {
                var filtered = commonService.filterRetired(data.results);//TODO: filter must be dome in backend system
                vm.icdDiagnosis = dropSizeToLimit(filtered);
            });
        };

        function initPharmacyPickups() {
            var pharmacyEncounterUuid = "e279133c-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file

            encounterService.getEncountersForEncounterType(patientUuid, pharmacyEncounterUuid).success(function (data) {
                vm.pickups = dropSizeToLimit(commonService.filterGroupReverse(data));
            });
        };

        function initPharmacyPickupsNew() {
            var patientUuid = $stateParams.patientUuid;
            var pharmacyEncounterTypeUuid = "18fd49b7-6c2b-4604-88db-b3eb5b3a6d5f";

            encounterService.getEncountersForEncounterType(patientUuid, pharmacyEncounterTypeUuid).success(function (data) {
                var nonRetired = prepareDispenses(commonService.filterReverse(data));
                vm.newPickups = dropSizeToLimit(nonRetired);

            });
        };

        var prepareDispenses = function (encounters) {

            var dispenses = [];

            _.forEach(encounters, function (encounter) {
                var dispense = {};
                dispense.detetime = encounter.encounterDatetime;
                dispense.provider = encounter.provider;
                dispense.items = [];
                _.forEach(encounter.obs, function (obs) {
                    var item = {};
                    item.order = obs.groupMembers[0].order;
                    item.quantity = commonService.findByMemberConcept(obs.groupMembers, "e1de2ca0-1d5f-11e0-b929-000c29ad1d07");
                    item.returnDate = commonService.findByMemberConcept(obs.groupMembers, "e1e2efd8-1d5f-11e0-b929-000c29ad1d07");

                    dispense.items.push(item);
                });
                dispenses.push(dispense);
            });

            return dispenses;
        };

        function initPrescriptions() {
            var concepts = [Bahmni.Common.Constants.prescriptionConvSetConcept];

            var patient = $rootScope.patient;
            var adultFollowupEncounterUuid = Bahmni.Common.Constants.adultFollowupEncounterUuid;
            var childFollowupEncounterUuid = Bahmni.Common.Constants.childFollowupEncounterUuid;

            encounterService.getEncountersForEncounterType(patient.uuid,
            (patient.age.years >= 15) ? adultFollowupEncounterUuid : childFollowupEncounterUuid)
                    .success(function (data) {
                        var filteredResults = commonService.filterGroupReverseFollowupObs(concepts, data.results);
                        vm.prescriptions = [];

                        _.forEach(filteredResults, function (filteredResult) {
                            var existingModels = {
                                prescriptionDate: filteredResult.encounterDatetime,
                                models: []
                            };

                            _.forEach(filteredResult.obs, function (pSet) {
                                var existingModel = angular.copy(Bahmni.Common.Constants.drugPrescriptionConvSet);
                                for (var key in existingModel) {
                                    var m = existingModel[key];
                                    var foundModel = _.find(pSet.groupMembers, function (element) {
                                        return element.concept.uuid === m.uuid;
                                    });
                                    if (_.isUndefined(foundModel)) continue;

                                    if (key === "otherDrugs") {
                                        if (_.includes(Bahmni.Common.Constants.prophilaxyDrugConcepts, foundModel.value.uuid)) {
                                            continue;
                                        }
                                    }
                                    if (key === "prophilaxyDrugs") {
                                        if (!_.includes(Bahmni.Common.Constants.prophilaxyDrugConcepts, foundModel.value.uuid)) {
                                            continue;
                                        }
                                    }

                                    m.model = foundModel.concept;
                                    m.value = foundModel.value;
                                }
                                existingModels.models.push(existingModel);
                            });
                            vm.prescriptions.push(existingModels);
                        });
                    });
        };

        function initAllergies() {
            var concepts = ["e1e07ece-1d5f-11e0-b929-000c29ad1d07", "e1da757e-1d5f-11e0-b929-000c29ad1d07"];

            var adultFollowupEncounterUuid = "e278f956-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file
            var childFollowupEncounterUuid = "e278fce4-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file

            var patient = commonService.deferPatient($rootScope.patient);

            encounterService.getEncountersForEncounterType(patient.uuid,
            (patient.age.years >= 15) ? adultFollowupEncounterUuid : childFollowupEncounterUuid)
                    .success(function (data) {
                        vm.allergies = dropSizeToLimit(commonService.filterGroupReverseFollowupObs(concepts, data.results));

            });
        };

        function initVitals() {
            var concepts = ["e1e2e934-1d5f-11e0-b929-000c29ad1d07",
                "e1e2e826-1d5f-11e0-b929-000c29ad1d07",
                "e1da52ba-1d5f-11e0-b929-000c29ad1d07",
                "e1e2e70e-1d5f-11e0-b929-000c29ad1d07",
                "e1e2e3d0-1d5f-11e0-b929-000c29ad1d07"
            ];//TODO: create in configuration file

            var adultFollowupEncounterUuid = "e278f956-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file
            var childFollowupEncounterUuid = "e278fce4-1d5f-11e0-b929-000c29ad1d07";//TODO: create in configuration file

            var patient = commonService.deferPatient($rootScope.patient);

            encounterService.getEncountersForEncounterType(patient.uuid,
            (patient.age.years >= 15) ? adultFollowupEncounterUuid : childFollowupEncounterUuid)
                    .success(function (data) {
                        vm.vitals = dropSizeToLimit(commonService.filterGroupReverseFollowupObs(concepts, data.results));

            });
        };

        vm.isObject = function (value) {
            return _.isObject(value);
        };

        vm.filterDate = function (obs) {
            if (obs.concept.uuid === "892a98b2-9c98-4813-b4e5-0b434d14404d" 
                || obs.concept.uuid === "e1e2efd8-1d5f-11e0-b929-000c29ad1d07") {
                return $filter('date')(obs.value, "MMM d, y");
            }

            return obs.value;
        };

    };
