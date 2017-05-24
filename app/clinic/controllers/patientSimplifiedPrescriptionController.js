'use strict';

angular.module('clinic')
        .controller('PatientSimplifiedPrescriptionController', ["$q", "$http", "$filter", "$scope", "$rootScope", "$stateParams",
                        "encounterService", "observationsService", "commonService", "conceptService", "localStorageService",
                        "notifier", "spinner",
                    function ($q, $http, $filter, $scope, $rootScope, $stateParams, encounterService,
                    observationsService, commonService, conceptService, localStorageService, notifier, spinner) {
        var patientUuid;
        var markedOn = "488e6803-c7db-43b2-8911-8d5d2a8472fd";
        var dateUtil = Bahmni.Common.Util.DateUtil;

        $scope.showMessages = false;
        $scope.hasEntryToday = false;//there is no followup encouter for the patient today
        $scope.hasServiceToday = false;//there is no prescription service for the patient today
        $scope.arvLineEnabled = true;

        var init = function() {
            patientUuid = $stateParams.patientUuid;
            $scope.listedPrescriptions = [];
            $scope.existingPrescriptions = [];
            $scope.order = {};

            $scope.fieldModels = angular.copy(Bahmni.Common.Constants.drugPrescriptionConvSet);
            var deferred = $q.defer();

            conceptService.get(Bahmni.Common.Constants.prescriptionConvSetConcept).success(function (data) {
                for (var key in $scope.fieldModels) {
                    var fieldModel = $scope.fieldModels[key];
                    var members = angular.copy(data.setMembers);
                    var foundModel = _.find(members, function (element) {
                        return element.uuid === fieldModel.uuid;
                    });

                    fieldModel.model = foundModel;
                }
                var encounterType = ($rootScope.patient.age.years >= 15) ? Bahmni.Common.Constants.adultFollowupEncounterUuid :
                        Bahmni.Common.Constants.childFollowupEncounterUuid;

                spinner.forPromise(loadSavedPrescriptions(patientUuid, encounterType));
                deferred.resolve();
            });

            return deferred.promise;
        };

        $scope.getDrugs = function (request) {
            if (request.length < 3) return;

            return $http.get(Bahmni.Common.Constants.drugUrl, {
                    params: {
                        q: request,
                        s: "default",
                        v: "custom:(display,uuid,concept:(display,uuid)"
                    }
                })
                .then(function (response) {
                    return response.data.results.map(function (drug) {
                        return drug;
                    });
                });
        };

        $scope.checkDrugType = function (drug) {
            if (!_.isObject(drug)) {
                return;
            }
            //check if drug is ARV
            var arvRepr = $rootScope.drugMapping.arvDrugs[drug.uuid];

            if (arvRepr !== undefined) {
                $scope.order.isArv = true;
            } else {
                $scope.order.isArv = false;
                $scope.order.interruptedReason = {};
                $scope.order.isPlanInterrupted = false;
                $scope.order.arvPlan = {};
            }
        };

        var resetForm = function (form) {
            if (form) {
              form.$setPristine();
              form.$setUntouched();
            }
            $scope.order = {};
        };

        $scope.reset = function (form) {
            resetForm(form);
        };

        $scope.add = function (valid, form) {
            if (!valid) {
                $scope.showMessages = true;
                return;
            }
            //avoid duplication of drugs
            var sameOrderItem = _.find($scope.listedPrescriptions, function (order) {
                return order.drug.uuid === $scope.order.drug.uuid;
            });

            if (sameOrderItem !== undefined) {
                notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ITEM_ALREADY_IN_LIST'));
                return;
            }
            //avoid ARV duplication in the list
            var existingArvItem = _.find($scope.listedPrescriptions, function (order) {
                return order.isArv === true;
            });

            if ($scope.order.isArv && existingArvItem !== undefined) {
                notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ARV_ITEM_ALREADY_IN_LIST'));
                return;
            }
            $scope.listedPrescriptions.push($scope.order);
            resetForm(form);
            $scope.showNewPrescriptionsControlls = true;
            $scope.showMessages = false;
        };

        $scope.remove = function (item) {
           _.pull($scope.listedPrescriptions, item);
           isPrescriptionControl();
        };

        $scope.removeAll = function () {
          $scope.listedPrescriptions = [];
        };

        $scope.edit = function (item) {
           $scope.order = item;
           _.pull($scope.listedPrescriptions, item);
           isPrescriptionControl();
        };

        var isPrescriptionControl = function () {
           if (_.isEmpty($scope.listedPrescriptions)) {
               $scope.showNewPrescriptionsControlls = false;
           }
        };

        var genSimpleObs = function (concept, value, datetime) {
          return {
              concept: concept,
              obsDatetime: datetime,
              person: patientUuid,
              value: value
          }
        };

        $scope.save = function () {
            //build obs
            var obs = [];
            var orders = [];
            var datetime = dateUtil.now();

            _.forEach($scope.listedPrescriptions, function (element) {
                //############# Order with OBS model ###############
                //check the drug type
                if (element.isArv) {
                    //create and add the regimen obs
                    obs.push(genSimpleObs(Bahmni.Common.Constants.arvConceptUuid, element.drug.concept.uuid, datetime));
                    //create and add the Arv plan
                    obs.push(genSimpleObs(Bahmni.Common.Constants.drugPrescriptionConvSet.artPlan.uuid, element.arvPlan.uuid, datetime));
                    //create and add the regime stop reason if any
                    if (element.isPlanInterrupted) {
                        obs.push(genSimpleObs(Bahmni.Common.Constants.drugPrescriptionConvSet.interruptedReason.uuid,
                            element.interruptedReason.uuid, datetime));
                    }
                    //create and add the regime change reason if any
                    if (element.isPlanChanged) {
                        obs.push(genSimpleObs(Bahmni.Common.Constants.drugPrescriptionConvSet.changeReason.uuid,
                         element.changeReason.uuid, datetime));
                    }
                } else {
                    //non ARV drug
                    obs.push(genSimpleObs(Bahmni.Common.Constants.otherDrugsConceptUuid, element.drug.concept.uuid, datetime));
                }
                //############ Order with Drug Order model ##############
                //Assumig this is allways an OUTPATIENT
                //TODO: careSetting should be requested from backend system via Rest API
                var order = {
                    concept: element.drug.concept.uuid,
                    patient: patientUuid,
                    type: "drugorder",
                    careSetting: "6f0c9a92-6f24-11e3-af88-005056821db0",
                    dosingInstructions: element.dosingInstructions.uuid,
                    orderer: $rootScope.currentProvider.uuid,
                    dose: element.doseAmount,
                    doseUnits: element.dosingUnits.uuid,
                    frequency: element.dosgeFrequency.uuid,
                    route: element.drugRoute.uuid,
                    duration: element.duration,
                    durationUnits: element.durationUnits.uuid,
                    numRefills: 0,
                    quantity: 0,
                    quantityUnits: element.dosingUnits.uuid,
                    drug: element.drug.uuid
                };
                orders.push(order);
            });
            //create obs for markedOn
            var markedOnObs = {
                concept: markedOn,
                obsDatetime: datetime,
                person: patientUuid,
                value: dateUtil.getDateInDatabaseFormat(datetime)
            };
            obs.push(markedOnObs);
            //whether to create new encounter or update the obs list of existing one for this chackin
            if ($scope.hasEntryToday) {
                //copy existing encounter
                var encounter = {
                    uuid: $scope.todaysEncounter.uuid,
                    provider: $rootScope.currentUser.person.uuid,
                    obs: obs,
                    orders: orders
                };
                encounterService.update(encounter).success(encounterSuccessCallback);
            } else {
                //build new encounter
                var encounter = {
                    encounterType: ($rootScope.patient.age.years >= 15) ? Bahmni.Common.Constants.adultFollowupEncounterUuid :
                            Bahmni.Common.Constants.childFollowupEncounterUuid,
                    form: ($rootScope.patient.age.years >= 15) ? Bahmni.Common.Constants.followupAdultFormUuid :
                            Bahmni.Common.Constants.followupChildFormUuid,
                    encounterDatetime: datetime,
                    location: localStorageService.cookie.get("emr.location").uuid,
                    patient: patientUuid,
                    provider: $rootScope.currentUser.person.uuid,
                    obs: obs,
                    orders: orders
                };
                encounterService.create(encounter).success(encounterSuccessCallback);
            }
        };

        var encounterSuccessCallback = function (encounterProfileData) {
            console.log(encounterProfileData);
            notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
            spinner.forPromise(loadSavedPrescriptions(encounterProfileData.patient.uuid, encounterProfileData.encounterType.uuid));
            $scope.listedPrescriptions = [];
            isPrescriptionControl();
        };

        $scope.validatePlan = function (order) {
            if ($scope.order.arvPlan.uuid ===
                    Bahmni.Common.Constants.artInterruptedPlanUuid) {
                order.isPlanInterrupted = true;
            } else {
                order.isPlanInterrupted = false;
            }
        };

        //TODO: This logic should go to the pharmacy module
        var loadSavedPrescriptions = function (patient, encounterType) {
            var deferred = $q.defer();
            encounterService.getEncountersForEncounterType(patient, encounterType, "full").success(function (data) {
                    if (_.isEmpty(data.results)) return;

                    $scope.existingPrescriptions = [];
                    var nonVoidedEncounters = encounterService.filterRetiredEncoounters(data.results);
                    var sortedEncounters = _.sortBy(nonVoidedEncounters, function (encounter) {
                        return moment(encounter.encounterDatetime).toDate();
                    }).reverse();
                    //get todays entry
                    var lastEncounter = _.maxBy(sortedEncounters, "encounterDatetime");
                    if (dateUtil.diffInDaysRegardlessOfTime(lastEncounter.encounterDatetime,
                                        dateUtil.now()) === 0) {
                        $scope.todaysEncounter = lastEncounter;
                        $scope.hasEntryToday = true;
                        //find markedOn concept
                        var markedOnInfo = _.find(lastEncounter.obs, function (o) {
                            return o.concept.uuid === markedOn;
                        });

                        if (!_.isUndefined(markedOnInfo)) $scope.hasServiceToday = true;
                    }

                    var filteredEncounters = _.filter(sortedEncounters, function (e) {
                        var foundObs = _.find(e.obs, function (o) {
                            return o.concept.uuid === markedOn;
                        });
                        return typeof foundObs !== "undefined";
                    });
                    //create list of existing encounters with active orders
                    $scope.encounterOrders = [];
                    _.forEach(filteredEncounters, function (encounter) {
                        //avoid encounters with no orders
                        if (_.isEmpty(encounter.orders)) {
                            return;
                        }
                        //check if encounter has at least one active order
                        //TODO: This should be included in a call to the pharmacy module via rest
                        var activeOrder = _.find(encounter.orders, function (order) {
                            return order.action === "NEW";
                        });
                        //avoid terminaded prescriptions
                        if (activeOrder === undefined) {
                            return;
                        }
                        //start composing orders
                        var prescriptionDateObs = _.find(encounter.obs, function (o) {
                            return o.concept.uuid === markedOn;
                        });
                        var encounterOrder = {
                            prescriptionDatetime: prescriptionDateObs.value,
                            orders: []
                        };
                        _.forEach(encounter.orders, function (savedOrder) {
                            var order = {};
                            order.drug = savedOrder.drug;
                            order.doseAmount = savedOrder.dose;
                            order.dosingUnits = swapObsToConceptAnswer(savedOrder.doseUnits.uuid,
                                        $scope.fieldModels.dosingUnits.model.answers);
                            order.dosgeFrequency = savedOrder.frequency;
                            order.drugRoute = swapObsToConceptAnswer(savedOrder.route.uuid,
                                        $scope.fieldModels.drugRoute.model.answers);
                            order.duration = savedOrder.duration;
                            order.durationUnits = swapObsToConceptAnswer(savedOrder.durationUnits.uuid,
                                        $scope.fieldModels.durationUnits.model.answers);
                            order.dosingInstructions = swapObsToConceptAnswer(savedOrder.dosingInstructions,
                                $scope.fieldModels.dosingInstructions.model.answers);
                            //check if drug is ARV type
                            var arvRepr = $rootScope.drugMapping.arvDrugs[savedOrder.drug.uuid];
                            if (arvRepr !== undefined) {
                                order.isArv = true;
                                //find and swap arv plan
                                var arvPlan = _.find(encounter.obs, function (o) {
                                    return o.concept.uuid === Bahmni.Common.Constants.drugPrescriptionConvSet.artPlan.uuid;
                                });
                                if (arvPlan !== undefined) {
                                    order.arvPlan = swapObsToConceptAnswer(arvPlan.value.uuid,
                                        $scope.fieldModels.artPlan.model.answers);
                                }
                                //find and swap plan interupted reason
                                var interruptedReason = _.find(encounter.obs, function (o) {
                                    return o.concept.uuid === Bahmni.Common.Constants.drugPrescriptionConvSet.interruptedReason.uuid;
                                });
                                if (interruptedReason !== undefined) {
                                    order.interruptedReason = swapObsToConceptAnswer(interruptedReason.value.uuid,
                                        $scope.fieldModels.interruptedReason.model.answers);
                                    order.isPlanInterrupted = true;
                                }
                                //find and swap plan change reason
                                var changeReason = _.find(encounter.obs, function (o) {
                                    return o.concept.uuid === Bahmni.Common.Constants.drugPrescriptionConvSet.changeReason.uuid;
                                });
                                if (changeReason !== undefined) {
                                    order.changeReason = swapObsToConceptAnswer(changeReason.value.uuid,
                                        $scope.fieldModels.changeReason.model.answers);
                                }
                            }
                            encounterOrder.orders.push(order);
                        });
                        $scope.encounterOrders.push(encounterOrder);
                    });
                deferred.resolve();
            });
            return deferred.promise;
        };

        $scope.refill = function (drug) {
            $scope.listedPrescriptions.push(drug);
            $scope.showNewPrescriptionsControlls = true;
        };

        var swapObsToConceptAnswer = function (obs, conceptAnswers) {
            return _.find(conceptAnswers, function (answer) {
                return obs === answer.uuid;
            });
        };

        return spinner.forPromise(init());
    }]);
