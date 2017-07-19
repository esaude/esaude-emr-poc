(function () {
  'use strict';

  angular
    .module('common.prescription')
    .controller('PatientSimplifiedPrescriptionController', PatientSimplifiedPrescriptionController);

  PatientSimplifiedPrescriptionController.$inject = ['$http', '$filter', '$rootScope', '$stateParams',
    'observationsService', 'commonService', 'conceptService', 'localStorageService', 'notifier', 'spinner',
    'drugService', 'prescriptionService'];

  /* @ngInject */
  function PatientSimplifiedPrescriptionController($http, $filter, $rootScope, $stateParams, observationsService,
                                                   commonService, conceptService, localStorageService, notifier, spinner,
                                                   drugService, prescriptionService) {


    var currentProvider = $rootScope.currentProvider;
    var drugMapping = $rootScope.drugMapping;
    var patientUuid;
    var patient = $rootScope.patient;

    var vm = this;
    vm.allRegimens = [];
    vm.arvDrugs = [];
    vm.arvLineEnabled = true;
    vm.encounterOrders = [];
    vm.fieldModels = angular.copy(Bahmni.Common.Constants.drugPrescriptionConvSet);
    vm.hasEntryToday = false;//there is no followup encouter for the patient today
    vm.hasServiceToday = false;//there is no prescription service for the patient today
    vm.isArvPlanInterruptedEdit = false;
    vm.isRegimenChangeEdit = false;
    vm.isRegimenEdit = false;
    vm.listedPrescriptions = [];
    vm.order = {};
    vm.prescriptionDate = new Date();
    vm.regimens = {};
    vm.showMessages = false;
    vm.showNewPrescriptionsControlls = false;
    vm.todaysEncounter = {};


    vm.add = add;
    vm.checkDrugType = checkDrugType;
    vm.doPlanChanged = doPlanChanged;
    vm.doRegimenChanges = doRegimenChanges;
    vm.doTherapeuticLineChanges = doTherapeuticLineChanges;
    vm.edit = edit;
    vm.getDrugs = getDrugs;
    vm.initTherapeuticLine = initTherapeuticLine;
    vm.refill = refill;
    vm.remove = remove;
    vm.removeAll = removeAll;
    vm.reset = reset;
    vm.save = save;

    activate();

    ////////////////

    function activate() {
      patientUuid = $stateParams.patientUuid;

      function setFieldModels(setMembers) {
        for (var key in vm.fieldModels) {
          var fieldModel = vm.fieldModels[key];
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
          vm.allRegimens = result.data;
        });
      }

      var load = conceptService.getPrescriptionConvSetConcept()
        .then(setFieldModels)
        .then(loadSavedPrescriptions(patient))
        .then(loadAllRegimens());

      spinner.forPromise(load);
    }


    function add(valid, form) {
      if (!valid) {
        vm.showMessages = true;
        return;
      }
      //avoid duplication of drugs
      var sameOrderItem = _.find(vm.listedPrescriptions, function (order) {
        return order.drug.uuid === vm.order.drug.uuid;
      });

      if (sameOrderItem) {
        notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ITEM_ALREADY_IN_LIST'));
        return;
      }
      vm.listedPrescriptions.push(vm.order);
      resetForm(form);
      vm.showNewPrescriptionsControlls = true;
      vm.showMessages = false;
    }


    function checkDrugType(drug) {
      if (!_.isObject(drug)) {
        return;
      }
      //check if drug is ARV
      var arvRepr = drugMapping.arvDrugs[drug.uuid];

      if (arvRepr) {
        vm.order.isArv = true;
      } else {
        vm.order.isArv = false;
        vm.order.interruptedReason = {};
        vm.order.isPlanInterrupted = false;
        vm.order.arvPlan = {};
      }
    }


    function doPlanChanged(order) {
      if (vm.order.arvPlan.uuid === Bahmni.Common.Constants.artInterruptedPlanUuid) {
        order.isPlanInterrupted = true;
        vm.isArvPlanInterruptedEdit = true;
      } else {
        order.isPlanInterrupted = false;
        vm.isArvPlanInterruptedEdit = false;
        vm.order.interruptedReason = undefined;
      }
    }


    function doRegimenChanges(regimen) {
      //edit regimen
      vm.order.isRegimenCancelDisabled = false;
      //compare new and old regimen
      if (!_.isUndefined(vm.order.currentRegimen) && vm.order.currentRegimen.uuid !== regimen.uuid) {
        //pervent change regimen if ARV item is selected
        var selectedArvItem = _.find(vm.listedPrescriptions, function (item) {
          return item.isArv === true;
        });
        if (selectedArvItem) {
          notifier.error($filter('translate')('CLINIC_MESSAGE_ERROR_CANNOT_CHANGE_REGIMEN'));
          vm.order.regimen = vm.order.currentRegimen;
          vm.order.therapeuticLine = vm.order.currentArvLine;
          return;
        }
        vm.order.isRegimenChanged = true;
        vm.isRegimenChangeEdit = true;
      } else {
        vm.order.isRegimenChanged = false;
        vm.isRegimenChangeEdit = false;
        vm.order.changeReason = undefined;
      }
      getDrugsOfRegimen(regimen);
    }


    function doTherapeuticLineChanges(therapeuticLine) {
      //should never go lower

      //edit regimen
      vm.order.isRegimenCancelDisabled = true;
      vm.regimens = filterRegimens(vm.allRegimens, therapeuticLine);//update the list of regimens
      vm.order.regimen = undefined;
    }


    function edit(item) {
      vm.order = item;
      _.pull(vm.listedPrescriptions, item);
      isPrescriptionControl();
    }


    function getDrugs(request) {
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
    }


    function initTherapeuticLine() {
      //use regimen of already selected ARV line as the default one
      var selectedArvItem = _.find(vm.listedPrescriptions, function (item) {
        return item.isArv === true;
      });

      if (selectedArvItem) {
        vm.order.therapeuticLine = selectedArvItem.therapeuticLine;
        vm.order.currentArvLine = selectedArvItem.therapeuticLine;
        vm.order.currentRegimen = selectedArvItem.regimen;
        vm.order.regimen = selectedArvItem.regimen;
        return;
      }

      //get the last therapeutic line
      observationsService.get(patientUuid, Bahmni.Common.Constants.drugPrescriptionConvSet.therapeuticLine.uuid)
        .success(function (data) {
          if (_.isEmpty(data.results)) {
            vm.order.therapeuticLine = _.find(vm.fieldModels.therapeuticLine.model.answers,
              function (answer) {
                return answer.uuid === Bahmni.Common.Constants.therapeuticLineQuestion.firstLine;
              });
          } else {
            var nonRetired = commonService.filterRetired(data.results);
            var maxObs = _.maxBy(nonRetired, 'obsDatetime');

            if (maxObs) {
              vm.order.therapeuticLine = swapObsToConceptAnswer(maxObs.value.uuid, vm.fieldModels.therapeuticLine.model.answers);

              if (maxObs.value.uuid === Bahmni.Common.Constants.therapeuticLineQuestion.thirdLine) {
                vm.arvLineEnabled = false;
              }
            }
          }
          vm.order.currentArvLine = angular.copy(vm.order.therapeuticLine);
          // filter the regimens according to age and therapeutic line
          var filteredRegimens = filterRegimens(vm.allRegimens, vm.order.therapeuticLine);
          initRegimens(filteredRegimens);
        });
    }


    function refill(drug) {
      vm.listedPrescriptions.push(angular.copy(drug));
      vm.showNewPrescriptionsControlls = true;
    }


    function remove(item) {
      _.pull(vm.listedPrescriptions, item);
      isPrescriptionControl();
    }


    function removeAll() {
      vm.listedPrescriptions = [];
      isPrescriptionControl();
    }


    function reset(form) {
      resetForm(form);
    }


    function save() {

      var prescription = {

        prescriptionDate: vm.prescriptionDate,
        patient: {uuid: patientUuid},
        provider: {uuid: currentProvider.uuid},
        location: {uuid: localStorageService.cookie.get("emr.location").uuid},
        prescriptionItems: []
      };

      setARTValues(prescription);

      _.forEach(vm.listedPrescriptions, function (element) {

        var prescriptionItem = {

          drugOrder: {
            concept: {uuid: element.drug.concept.uuid},
            type: "drugorder",
            careSetting: {uuid: "6f0c9a92-6f24-11e3-af88-005056821db0"},
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

      prescriptionService.create(prescription)
        .then(function () {
          notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
          vm.listedPrescriptions = [];
          isPrescriptionControl();
          spinner.forPromise(loadSavedPrescriptions($rootScope.patient));
        })
        .catch(function () {
          notifier.error($filter('translate')('COMMON_MESSAGE_COULD_NOT_CREATE_PRESCRIPTION'));
        });
    }

    function resetForm(form) {
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
      vm.order = {};
    }


    function isPrescriptionControl() {
      if (_.isEmpty(vm.listedPrescriptions)) {
        vm.showNewPrescriptionsControlls = false;
      }
    }


    function genSimpleObs(concept, value, datetime) {
      return {
        concept: concept,
        obsDatetime: datetime,
        person: patientUuid,
        value: value
      }
    }


    function setARTValues(prescription) {

      var arvRegime = null;
      var arvPlan = null;
      var changeReason = null;
      var interruptionReason = null;

      _.forEach(vm.listedPrescriptions, function (element) {

        if (element.isArv) {
          arvRegime = element.regimen;
          arvPlan = element.therapeuticLine.uuid;
        }

        if (element.isPlanChanged) {
          changeReason = element.changeReason.uuid;
        }

        if (element.isPlanInterrupted) {

          interruptionReason = element.interruptedReason.uuid;

        }
      });

      prescription.regime = arvRegime;
      prescription.arvPlan = arvPlan ? {uuid: arvPlan} : null;
      prescription.changeReason = changeReason ? changeReason : null;
      prescription.interruptionReason = interruptionReason ? interruptionReason : null;
    }


    function loadSavedPrescriptions(patient) {
      return prescriptionService.getPatientPrescriptions(patient).then(function (prescription) {
        vm.todaysEncounter = prescription.todaysEncounter;
        vm.hasEntryToday = prescription.hasEntryToday;
        vm.hasServiceToday = prescription.hasServiceToday;
        vm.encounterOrders = prescription.encounterOrders;
      });
    }


    function filterRegimens(allRegimens, therapeuticLine) {
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
    }


    function initRegimens(filteredRegimens) {
      vm.regimens = filteredRegimens;
      //get the last regimen
      observationsService.get(patientUuid, Bahmni.Common.Constants.arvConceptUuid)
        .success(function (data) {
          var nonRetired = commonService.filterRetired(data.results);
          var maxObs = _.maxBy(nonRetired, 'obsDatetime');

          if (maxObs) {
            var swappedObsToConcept = swapObsToConceptAnswer(maxObs.value.uuid, filteredRegimens.answers);
            vm.order.regimen = swappedObsToConcept;
            vm.order.currentRegimen = swappedObsToConcept;
            //ask for regimen input if doesn't exist
            if (swappedObsToConcept) {
              getDrugsOfRegimen(swappedObsToConcept);
            } else {
              vm.isRegimenEdit = true;
            }
          }
        });
    }


    function getDrugsOfRegimen(regimen) {
      drugService.get(regimen.uuid)
        .success(function (data) {
          vm.arvDrugs = _.map(data.results, 'drugItem.drug');
        });
    }


    function swapObsToConceptAnswer(obs, conceptAnswers) {
      return _.find(conceptAnswers, function (answer) {
        return obs === answer.uuid;
      });
    }


  }

})();

