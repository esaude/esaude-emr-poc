'use strict';

angular.module('common.prescription')
        .controller('PatientSimplifiedPrescriptionController', ["$http", "$filter", "$scope", "$rootScope", "$stateParams",
                        "encounterService", "observationsService", "commonService", "conceptService", "localStorageService",
                        "notifier", "spinner", "drugService", "prescriptionService",
                    function ($http, $filter, $scope, $rootScope, $stateParams, encounterService,
                    observationsService, commonService, conceptService, localStorageService, notifier, spinner, drugService,
                    prescriptionService) {

        var patientUuid;
        var markedOn = "488e6803-c7db-43b2-8911-8d5d2a8472fd";
        var dateUtil = Bahmni.Common.Util.DateUtil;

        $scope.showMessages = false;
        $scope.hasEntryToday = false;//there is no followup encouter for the patient today
        $scope.hasServiceToday = false;//there is no prescription service for the patient today
        $scope.arvLineEnabled = true;
        $scope.today = new Date();
        $scope.prescriptionDate = $scope.today;

        var init = function() {
            patientUuid = $stateParams.patientUuid;
            $scope.listedPrescriptions = [];
            $scope.order = {};
            $scope.regimens = {};

            $scope.fieldModels = angular.copy(Bahmni.Common.Constants.drugPrescriptionConvSet);

            function setFieldModels(setMembers) {
                for (var key in $scope.fieldModels) {
                    var fieldModel = $scope.fieldModels[key];
                    var members = angular.copy(setMembers);
                    fieldModel.model = _.find(members, function (element) {
                        return element.uuid === fieldModel.uuid;
                    });
                }
            }

            //also get the available regimens here for later
            function loadAllRegimens() {
                //also get the available regimens here for later
                return conceptService.get(Bahmni.Common.Constants.arvRegimensConvSet).then(function (result) {
                    $scope.allRegimens = result.data;
                });
            }

            return conceptService.getPrescriptionConvSetConcept()
                .then(setFieldModels)
                .then(loadSavedPrescriptions($rootScope.patient))
                .then(loadAllRegimens());
        };

        $scope.getDrugs = function (request) {
            if (request.length < 3) return;

            return $http.get(Bahmni.Common.Constants.drugResourceUrl, {
                    params: {
                        q: request,
                        v: "full"

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
          isPrescriptionControl();
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

            var prescription = {

              prescriptionDate: $scope.prescriptionDate,
              patient: {uuid: patientUuid },
              provider: {uuid: $rootScope.currentProvider.uuid},
              location : {uuid: localStorageService.cookie.get("emr.location").uuid},
              prescriptionItems:[]
            };

            setARTValues(prescription);

            _.forEach($scope.listedPrescriptions, function (element) {

              var prescriptionItem = {

                drugOrder : {
                    concept: {uuid: element.drug.concept.uuid},
                    type: "drugorder",
                    careSetting: { uuid: "6f0c9a92-6f24-11e3-af88-005056821db0"},
                    dosingInstructions: element.dosingInstructions.uuid,
                    dose: element.doseAmount,
                    doseUnits: {uuid: element.dosingUnits.uuid},
                    frequency: {uuid: element.dosgeFrequency.uuid},
                    route: {uuid: element.drugRoute.uuid},
                    duration: element.duration,
                    durationUnits: {uuid: element.durationUnits.uuid},
                    quantityUnits: {uuid: element.dosingUnits.uuid},
                    drug: {uuid: element.drug.uuid}
                 },
                regime: element.isArv ? element.regimen : null

              };

              prescription.prescriptionItems.push(prescriptionItem);
           });

          //TODO: Fix success CallBack
          prescriptionService.create(prescription).success(encounterSuccessCallback);
        };

         var setARTValues = function(prescription){

                var arvRegime = null;
                var arvPlan = null;
                var changeReason = null;
                var interruptionReason = null;

             _.forEach($scope.listedPrescriptions, function (element) {

                  if(element.isArv){
                     arvRegime = element.regimen;
                     arvPlan = element.therapeuticLine.uuid;
                  }

                  if(element.isPlanChanged)
                  {
                    changeReason = element.changeReason.uuid;
                  }

                  if(element.isPlanInterrupted){

                  interruptionReason =  element.interruptedReason.uuid;

                  }
             });

             prescription.regime = arvRegime;
             prescription.arvPlan = arvPlan? {uuid: arvPlan}: null;
             prescription.changeReason = changeReason? changeReason : null;
             prescription.interruptionReason = interruptionReason? interruptionReason : null;
         };

        var encounterSuccessCallback = function (encounterProfileData) {
            console.log(encounterProfileData);
            notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
            spinner.forPromise(loadSavedPrescriptions(encounterProfileData.patient.uuid, encounterProfileData.encounterType.uuid));
            $scope.listedPrescriptions = [];
            isPrescriptionControl();
        };

        //TODO: This logic should go to the pharmacy module
        var loadSavedPrescriptions = function (patient) {
          return prescriptionService.getPatientPrescriptions(patient).then(function (prescription) {
            $scope.todaysEncounter = prescription.todaysEncounter;
            $scope.hasEntryToday = prescription.hasEntryToday;
            $scope.hasServiceToday = prescription.hasServiceToday;
            $scope.encounterOrders = prescription.encounterOrders;
          });
        };

        $scope.refill = function (drug) {
            $scope.listedPrescriptions.push(drug);
            $scope.showNewPrescriptionsControlls = true;
        };

        $scope.doTherapeuticLineChanges = function (therapeuticLine) {
            //should never go lower

            //edit regimen
            $scope.order.isRegimenCancelDisabled = true;
            $scope.regimens = filterRegimens($scope.allRegimens, therapeuticLine);//update the list of regimens
            $scope.order.regimen = undefined;
        };

        $scope.doRegimenChanges = function (regimen) {
            //edit regimen
            $scope.order.isRegimenCancelDisabled = false;
            //compare new and old regimen
            if (!_.isUndefined($scope.order.currentRegimen) && $scope.order.currentRegimen.uuid !== regimen.uuid) {
                //pervent change regimen if ARV item is selected
                var selectedArvItem = _.find($scope.listedPrescriptions, function (item) {
                    return item.isArv === true;
                });
                if (selectedArvItem) {
                    notifier.error($filter('translate')('CLINIC_MESSAGE_ERROR_CANNOT_CHANGE_REGIMEN'));
                    $scope.order.regimen = $scope.order.currentRegimen;
                    $scope.order.therapeuticLine = $scope.order.currentArvLine;
                    return;
                }
                $scope.order.isRegimenChanged = true;
                $scope.isRegimenChangeEdit = true;
            } else {
                $scope.order.isRegimenChanged = false;
                $scope.isRegimenChangeEdit = false;
                $scope.order.changeReason = undefined;
            }
            getDrugsOfRegimen(regimen);
        };

        $scope.doPlamChanged = function (order) {
            if ($scope.order.arvPlan.uuid ===
                    Bahmni.Common.Constants.artInterruptedPlanUuid) {
                order.isPlanInterrupted = true;
                $scope.isArvPlanInterruptedEdit = true;
            } else {
                order.isPlanInterrupted = false;
                $scope.isArvPlanInterruptedEdit = false;
                $scope.order.interruptedReason = undefined;
            }
        };

        $scope.initTherapeuticLine = function () {
            //use regimen of already selected ARV line as the default one
            var selectedArvItem = _.find($scope.listedPrescriptions, function (item) {
                return item.isArv === true;
            });
            if (selectedArvItem) {
                $scope.order.therapeuticLine = selectedArvItem.therapeuticLine;
                $scope.order.currentArvLine = selectedArvItem.therapeuticLine;
                $scope.order.currentRegimen = selectedArvItem.regimen;
                $scope.order.regimen = selectedArvItem.regimen;
                return;
            };
            //get the last therapeutic line
            observationsService.get(patientUuid, Bahmni.Common.Constants.drugPrescriptionConvSet.therapeuticLine.uuid)
                        .success(function (data) {
                if (_.isEmpty(data.results)) {
                    $scope.order.therapeuticLine = _.find($scope.fieldModels.therapeuticLine.model.answers,
                        function (answer) {
                            return answer.uuid === Bahmni.Common.Constants.therapeuticLineQuestion.firstLine;
                    });
                } else {
                    var nonRetired = commonService.filterRetired(data.results);
                    var maxObs = _.maxBy(nonRetired, 'obsDatetime');

                    if (maxObs) {
                        var swappedObsToConcept = swapObsToConceptAnswer(maxObs.value.uuid, $scope.fieldModels.therapeuticLine.model.answers);
                        $scope.order.therapeuticLine = swappedObsToConcept;

                        if (maxObs.value.uuid === Bahmni.Common.Constants.therapeuticLineQuestion.thirdLine) {
                            $scope.arvLineEnabled = false;
                        }
                    }
                }
                $scope.order.currentArvLine = angular.copy($scope.order.therapeuticLine);
                // filter the regimens according to age and therapeutic line
                var filteredRegimens = filterRegimens($scope.allRegimens, $scope.order.therapeuticLine);
                initRegimens(filteredRegimens);
            });
        };

        var filterRegimens = function (allRegimens, therapeuticLine) {
            var age = ($rootScope.patient.age.years >= 15) ? "adult" : "child";
            var regimenGroupAge = Bahmni.Common.Constants.regimenGroups[age];
            var regimenGroupTLine = {};
            //find the current therapeutic line
            if (therapeuticLine.uuid === Bahmni.Common.Constants.therapeuticLineQuestion.firstLine) {
                regimenGroupTLine = regimenGroupAge.firstLine;
            }
            else if (therapeuticLine.uuid === Bahmni.Common.Constants.therapeuticLineQuestion.secondLine) {
                regimenGroupTLine = regimenGroupAge.secondLine;
            }
            else if (therapeuticLine.uuid === Bahmni.Common.Constants.therapeuticLineQuestion.thirdLine) {
                regimenGroupTLine = regimenGroupAge.thirdLine;
            }
            return _.find(allRegimens.setMembers, function (member) {
                return member.uuid === regimenGroupTLine;
            });
        };

        var initRegimens = function (filteredRegimens) {
            $scope.regimens = filteredRegimens;
            //get the last regimen
            observationsService.get(patientUuid, Bahmni.Common.Constants.arvConceptUuid)
                        .success(function (data) {
                var nonRetired = commonService.filterRetired(data.results);
                var maxObs = _.maxBy(nonRetired, 'obsDatetime');

                if (maxObs) {
                    var swappedObsToConcept = swapObsToConceptAnswer(maxObs.value.uuid, filteredRegimens.answers);
                    $scope.order.regimen = swappedObsToConcept;
                    $scope.order.currentRegimen = swappedObsToConcept;
                    //ask for regimen input if doesn't exist
                    if (swappedObsToConcept) {
                        getDrugsOfRegimen(swappedObsToConcept);
                    } else {
                        $scope.isRegimenEdit = true;
                    }
                }
            });
        };

        var getDrugsOfRegimen = function (regimen) {
            drugService.get(regimen.uuid)
                        .success(function (data) {
                $scope.arvDrugs = _.map(data.results, 'drugItem.drug');
            });
        }

        var swapObsToConceptAnswer = function (obs, conceptAnswers) {
            return _.find(conceptAnswers, function (answer) {
                return obs === answer.uuid;
            });
        };

        return spinner.forPromise(init());
    }]);
