(function () {
  'use strict';

  angular
    .module('common.prescription')
    .controller('PatientSimplifiedPrescriptionController', PatientSimplifiedPrescriptionController);

  PatientSimplifiedPrescriptionController.$inject = ['$http', '$filter', '$rootScope', '$stateParams',
    'observationsService', 'commonService', 'conceptService', 'localStorageService', 'notifier', 'spinner',
    'drugService', 'prescriptionService', 'providerService', 'sessionService', 'patientService'];

  /* @ngInject */
  function PatientSimplifiedPrescriptionController($http, $filter, $rootScope, $stateParams, observationsService,
                                                   commonService, conceptService, localStorageService, notifier, spinner,
                                                   drugService, prescriptionService, providerService, sessionService,
                                                   patientService) {
    var patientUuid;
    var patient = {};

    var vm = this;
    vm.allRegimes = [];
    vm.arvDrugs = [];
    vm.arvLineEnabled = true;
    vm.cancelationReasonSelected = null;
    vm.cancelationReasonTyped = null;
    vm.existingPrescriptions = [];
    vm.fieldModels = angular.copy(Bahmni.Common.Constants.drugPrescriptionConvSet);
    vm.isArvPlanInterruptedEdit = false;
    vm.isRegimenChangeEdit = false;
    vm.isRegimenEdit = false;
    vm.listedPrescriptions = [];
    vm.prescriptionDate = new Date();
    vm.prescriptionItem = {};
    vm.prescriptionItemToCancel = null;
    vm.providers = [];
    vm.regimes = {};
    vm.selectedProvider = { display: '' };
    vm.showMessages = false;
    vm.showMessagesInModal = false;
    vm.showNewPrescriptionsControlls = false;


    vm.add = add;
    vm.cancelOrStop = cancelOrStop;
    vm.checkDrugType = checkDrugType;
    vm.cleanDrugIfUnchecked = cleanDrugIfUnchecked;
    vm.closeCancellationModal = closeCancellationModal;
    vm.closeProviderAndPrescriptionModal = closeProviderAndPrescriptionModal;
    vm.doPlanChanged = doPlanChanged;
    vm.doRegimenChanges = doRegimenChanges;
    vm.doTherapeuticLineChanges = doTherapeuticLineChanges;
    vm.edit = edit;
    vm.getDrugs = getDrugs;
    vm.hasActivePrescription = hasActivePrescription;
    vm.initArvPlans = initArvPlans;
    vm.initTherapeuticLine = initTherapeuticLine;
    vm.refill = refill;
    vm.removeAll = removeAll;
    vm.remove = remove;
    vm.reset = reset;
    vm.saveRefill = saveRefill;
    vm.save = save;
    vm.setPrescriptionItemToCancel = setPrescriptionItemToCancel;
    vm.setPrescritpionItemStatus = setPrescritpionItemStatus;

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
        return true;
      }

      //also get the available regimens here for later
      function loadAllRegimes() {
        //also get the available regimens here for later
        return conceptService.get(Bahmni.Common.Constants.arvRegimensConvSet).then(function (result) {
          vm.allRegimes = result.data;
        });
      }

      var load = conceptService.getPrescriptionConvSetConcept()
        .then(setFieldModels)
        .then(function (z) {
          return patientService.getPatient($stateParams.patientUuid)
        })
        .then(function (p) {
          patient = p;
          return loadSavedPrescriptions(patient);
        })
        .then(loadAllRegimes())
        .then(getCurrentProvider)
        .then(function (currentProvider) {
        //  vm.selectedProvider = currentProvider;
        })
        .catch(function () {
          notifier.error($filter('translate')('COMMON_ERROR'));
        });

      spinner.forPromise(load);

      getProviders().then(function (providers) {
        vm.providers = providers;
      });
    }


    function add(valid, form) {
      if (!valid) {
        vm.showMessages = true;
        return;
      }

      if(!validateAddItem()){
        return;
      }

      //avoid duplication of drugs
      var sameOrderItem = _.find(vm.listedPrescriptions, function (item) {
        return item.drugOrder.drug.uuid === vm.prescriptionItem.drugOrder.drug.uuid;
      });

      if (sameOrderItem) {
        notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ITEM_ALREADY_IN_LIST'));
        return;
      }
      vm.listedPrescriptions.push(vm.prescriptionItem);
      resetForm(form);
      vm.showNewPrescriptionsControlls = true;
      vm.showMessages = false;
    }

    function validateAddItem() {

      var prescription = { prescriptionItems: [vm.prescriptionItem]};
      if(hasActiveArvPrescriptionForNewArvItem(prescription)){
        notifier.error($filter('translate')('COMMON_MESSAGE_COULD_NOT_ADD_ITEM_ARV_BECAUSE_EXISTS_AN_ACTIVE_ARV_PRESCRIPTION',{EXISTING_ITEM: vm.prescriptionItem.drugOrder.drug.display}));
        return false;
      }

      if(!_.isEmpty(getDuplicatedExistingActivePrescriptionItems(prescription))){
        notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_EXISTIS_ACTIVE_PRESCRIPTION_FOR_ENTERED_ITEM', {EXISTING_ITEM: vm.prescriptionItem.drugOrder.drug.display}));
        return false;
      }
      return true;
    }


    function checkDrugType(drug) {
      if (!_.isObject(drug)) {
        return;
      }
      if(!vm.prescriptionItem.drugOrder || vm.prescriptionItem.drugOrder.drug ){
      //check if drug is ARV

        drugService.isArvDrug(drug).then(function (isArv) {
          if (isArv) {
            vm.prescriptionItem.isArv = true;
            vm.prescriptionItem.drugOrder = null;
          } else {
            vm.prescriptionItem.isArv = false;
            vm.prescriptionItem.interruptedReason = {};
            vm.prescriptionItem.isPlanInterrupted = false;
            vm.prescriptionItem.arvPlan = {};
          }
        });
      }
    }


    function closeCancellationModal(form) {
      // TODO: handle close via esc key
      form.$setPristine();
      form.$setUntouched();
      vm.cancelationReasonSelected = null;
      vm.cancelationReasonTyped = null;
      getCancellationModal().modal('hide');
    }

     function closeProviderAndPrescriptionModal(form){
       form.$setPristine();
       form.$setUntouched();
       getProviderAndPrescriptionDateModal().modal('hide');
     }

    function doPlanChanged(item) {
      if (vm.prescriptionItem.arvPlan.uuid === Bahmni.Common.Constants.artInterruptedPlanUuid) {
        item.isPlanInterrupted = true;
        vm.isArvPlanInterruptedEdit = true;
      } else {
        item.isPlanInterrupted = false;
        vm.isArvPlanInterruptedEdit = false;
        vm.prescriptionItem.interruptedReason = undefined;
      }
    }


    function doRegimenChanges(regimen) {
      //edit regimen
      vm.prescriptionItem.isRegimenCancelDisabled = false;
      //compare new and old regimen
      if (!_.isUndefined(vm.prescriptionItem.currentRegimen) && vm.prescriptionItem.currentRegimen.uuid !== regimen.uuid) {
        //pervent change regimen if ARV item is selected
        var selectedArvItem = _.find(vm.listedPrescriptions, function (item) {
          return item.isArv === true;
        });
        if (selectedArvItem) {
          notifier.error($filter('translate')('CLINIC_MESSAGE_ERROR_CANNOT_CHANGE_REGIMEN'));
          vm.prescriptionItem.regime = vm.prescriptionItem.currentRegimen;
          vm.prescriptionItem.therapeuticLine = vm.prescriptionItem.currentArvLine;
          return;
        }
        vm.prescriptionItem.isRegimenChanged = true;
        vm.isRegimenChangeEdit = true;
      } else {
        vm.prescriptionItem.isRegimenChanged = false;
        vm.isRegimenChangeEdit = false;
        vm.prescriptionItem.changeReason = undefined;
      }
      getDrugsOfRegimen(regimen);
    }


    function doTherapeuticLineChanges(therapeuticLine) {
      //should never go lower

      //edit regimen
      vm.prescriptionItem.isRegimenCancelDisabled = true;
      vm.regimes = filterRegimes(vm.allRegimes, therapeuticLine);//update the list of regimes
      vm.prescriptionItem.regime = undefined;
    }


    function edit(item) {
      vm.prescriptionItem = item;
      if(item.regime){
         vm.prescriptionItem.isArv  = true;
      }
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
    function getProviders() {
      return providerService.getProviders()
        .catch(function () {
          notifier.error($filter('translate')('COMMON_ERROR'));
        });
    }

    function getCurrentProvider() {
      return sessionService.getCurrentProvider();
    }


    function initTherapeuticLine() {
      //use regimen of already selected ARV line as the default one
      var selectedArvItem = _.find(vm.listedPrescriptions, function (item) {
        return item.isArv === true;
      });

      if (selectedArvItem) {
        vm.prescriptionItem.therapeuticLine = selectedArvItem.therapeuticLine;
        vm.prescriptionItem.currentArvLine = selectedArvItem.therapeuticLine;
        vm.prescriptionItem.currentRegimen = selectedArvItem.regime;
        vm.prescriptionItem.regime = selectedArvItem.regime;
        return;
      }

      //get the last therapeutic line
      observationsService.get(patientUuid, Bahmni.Common.Constants.drugPrescriptionConvSet.therapeuticLine.uuid)
        .success(function (data) {
          if (_.isEmpty(data.results)) {
            vm.prescriptionItem.therapeuticLine = _.find(vm.fieldModels.therapeuticLine.model.answers,
              function (answer) {
                return answer.uuid === Bahmni.Common.Constants.therapeuticLineQuestion.firstLine;
              });
          } else {
            var nonRetired = commonService.filterRetired(data.results);
            var maxObs = _.maxBy(nonRetired, 'obsDatetime');

            if (maxObs) {
              vm.prescriptionItem.therapeuticLine = swapObsToConceptAnswer(maxObs.value.uuid, vm.fieldModels.therapeuticLine.model.answers);

              if (maxObs.value.uuid === Bahmni.Common.Constants.therapeuticLineQuestion.thirdLine) {
                vm.arvLineEnabled = false;
              }
            }
          }
          vm.prescriptionItem.currentArvLine = angular.copy(vm.prescriptionItem.therapeuticLine);
          // filter the regimes according to age and therapeutic line
          var filteredRegimes = filterRegimes(vm.allRegimes, vm.prescriptionItem.therapeuticLine);
          initRegimes(filteredRegimes);
        });
    }

    function refill(item) {
      item.drugOrder.dosingInstructions = {uuid: item.drugOrder.dosingInstructions};
       if(item.regime){
           item.isArv = true;
        }
        vm.listedPrescriptions.push(angular.copy(item));
        vm.showNewPrescriptionsControlls = true;
     }


    function remove(item) {
      _.pull(vm.listedPrescriptions, item);
      isPrescriptionControl();
    }

    function setPrescriptionItemToCancel(item) {
      vm.prescriptionItemToCancel = item;
    }

     function removeAll() {
      vm.listedPrescriptions = [];
      isPrescriptionControl();
    }


    function reset(form) {
      resetForm(form);
    }

    function saveRefill(form){

      if(!form.$valid){
        vm.showMessagesInModal = true;
        return;
      }
      save(form);
    }

    function save(form) {

      var prescription = {

        prescriptionDate: vm.prescriptionDate,
        patient: {uuid: patientUuid},
        provider: {uuid: vm.selectedProvider.uuid},
        location: {uuid: localStorageService.cookie.get("emr.location").uuid},
        prescriptionItems: []
      };

      _.forEach(vm.listedPrescriptions, function (element) {

        var prescriptionItem = {

          drugOrder: {
            type: "drugorder",
            careSetting: {uuid: "6f0c9a92-6f24-11e3-af88-005056821db0"},
            dosingInstructions: element.drugOrder.dosingInstructions.uuid,
            dose: element.drugOrder.dose,
            doseUnits: {uuid: element.drugOrder.doseUnits.uuid},
            frequency: {uuid: element.drugOrder.frequency.uuid},
            route: {uuid: element.drugOrder.route.uuid},
            duration: element.drugOrder.duration,
            durationUnits: {uuid: element.drugOrder.durationUnits.uuid},
            quantityUnits: {uuid: element.drugOrder.doseUnits.uuid},
            drug: {uuid: element.drugOrder.drug.uuid}
          },
          regime: element.isArv ? element.regime : null,
          therapeuticLine:  element.isArv ? element.therapeuticLine : null,
          arvPlan:  (element.isArv && element.arvPlan ) ? element.arvPlan: null,
          changeReason: (element.isArv && element.changeReason ) ? element.changeReason : null,
          interruptionReason: (element.isArv && element.interruptedReason ) ? element.interruptedReason : null

        };

        prescription.prescriptionItems.push(prescriptionItem);
      });

      if(validateCreatePrescription(form, prescription)){

           prescriptionService.create(prescription)
          .then(function () {
            notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
            vm.listedPrescriptions = [];
            vm.selectedProvider =  { display: '' };
            isPrescriptionControl();
            getProviderAndPrescriptionDateModal().modal('hide');
            spinner.forPromise(loadSavedPrescriptions(patient));
          })
          .catch(function () {
            notifier.error($filter('translate')('COMMON_MESSAGE_COULD_NOT_CREATE_PRESCRIPTION'));
          });
      }
      else{
        vm.selectedProvider = { display: '' };
      }
     }

    function validateCreatePrescription(form, prescription){

      if(form.selectedProvider.$invalid)
      {
        return false;
      }

      if(hasActiveArvPrescriptionForNewArvItem(prescription)){
        notifier.error($filter('translate')('COMMON_MESSAGE_COULD_NOT_CREATE_ARV_PRESCRIPTION_BECAUSE_EXISTS_AN_ACTIVE_ARV_PRESCRIPTION'));
        return false;
      }
      var duplicatedItems = getDuplicatedExistingActivePrescriptionItems(prescription);
      if(!_.isEmpty(duplicatedItems)){
        notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_EXISTIS_ACTIVE_PRESCRIPTIONS_FOR_ENTERED_ITEMS', {EXISTING_ITEM: _.flatMap(duplicatedItems, 'drugOrder.drug.display').toString()}));
        return false;
      }
      return true;
    }

    function hasActiveArvPrescriptionForNewArvItem(prescription){
      var exists = false;
      _.forEach(prescription.prescriptionItems, function (newPrescriptionItem) {
        if(newPrescriptionItem.regime){
          _.forEach(vm.existingPrescriptions, function (existingPrescription) {
            _.forEach(existingPrescription.prescriptionItems, function (prescriptionItem) {
              if(existingPrescription.prescriptionStatus === 'ACTIVE' && prescriptionItem.regime){
                exists = true;
              }
            });
          });
        }
      });
      return exists;
    }
    function getDuplicatedExistingActivePrescriptionItems(prescription) {
      var hasDuplicated = [];
      _.forEach(prescription.prescriptionItems, function (newPrescriptionItem) {
        _.forEach(vm.existingPrescriptions, function (existingPrescription) {
          _.forEach(existingPrescription.prescriptionItems, function (prescriptionItem) {
              if( prescriptionItem.status != 'FINALIZED'){
                  if(newPrescriptionItem.drugOrder.drug.uuid === prescriptionItem.drugOrder.drug.uuid){
                    hasDuplicated.push(prescriptionItem);
                  }
              }
          });
        });
      });
      return hasDuplicated;
    }

    function cleanDrugIfUnchecked(){

      if(!vm.prescriptionItem.isArv)
      {
        if(vm.prescriptionItem && vm.prescriptionItem.drugOrder){
          vm.prescriptionItem.drugOrder.drug = null;
          vm.prescriptionItem.therapeuticLine = null;
          vm.prescriptionItem.currentArvLine = null;
          vm.prescriptionItem.currentRegimen = null;
          vm.prescriptionItem.regime = null;
          vm.prescriptionItem.arvPlan = null;
        }
      }
    }

    function cancelOrStop(form, item){

      if (!form.$valid) {
        return;
      }

      var reason = (item.drugOrder.action ==='NEW') ? vm.cancelationReasonTyped : vm.cancelationReasonSelected.uuid;

      prescriptionService.stopPrescriptionItem(item.drugOrder, reason)
        .then(function () {
          notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
          vm.listedPrescriptions = [];
          closeCancellationModal(form);
          isPrescriptionControl();
          spinner.forPromise(loadSavedPrescriptions(patient));
        })
        .catch(function () {
          notifier.error($filter('translate')('COMMON_MESSAGE_COULD_NOT_CANCEL_PRESCRIPTION_ITEM'));
        });
    }

    function resetForm(form) {
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
      vm.prescriptionItem = {};
    }


    function isPrescriptionControl() {
      if (_.isEmpty(vm.listedPrescriptions)) {
        vm.showNewPrescriptionsControlls = false;
      }
    }

    function loadSavedPrescriptions(patient) {
      return prescriptionService.getAllPrescriptions(patient).then(function (patientPrescriptions) {
        vm.existingPrescriptions = _.sortBy(patientPrescriptions, ['prescriptionStatus','prescriptionDate'],['asc','desc']);
        vm.setPrescritpionItemStatus(vm.existingPrescriptions);
      });
    }

    function hasActivePrescription(prescriptions){

        return _.find(prescriptions, function (prescription) {
            return prescription.prescriptionStatus == true;
        });
    }

    function setPrescritpionItemStatus(prescriptions){
      _.forEach(prescriptions, function (prescription) {
         _.forEach(prescription.prescriptionItems, function (item) {
             item.statusStranslate = (item.status == 'FINALIZED') ? "PHARMACY_FINALIZED" : "PHARMACY_ACTIVE";
          });
       });
     }

    function filterRegimes(allRegimes, therapeuticLine) {
      var age = (patient.age.years >= 15) ? "adult" : "child";
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
      return _.find(allRegimes.setMembers, function (member) {
        return member.uuid === regimenGroupTLine;
      });
    }

    function initRegimes(filteredRegimes) {
      vm.regimes = filteredRegimes;
      //get the last regimen
      observationsService.get(patientUuid, Bahmni.Common.Constants.arvConceptUuid)
        .success(function (data) {
          var nonRetired = commonService.filterRetired(data.results);
          var maxObs = _.maxBy(nonRetired, 'obsDatetime');

          if (maxObs) {
            var swappedObsToConcept = swapObsToConceptAnswer(maxObs.value.uuid, filteredRegimes.answers);
            vm.prescriptionItem.regime = swappedObsToConcept;
            vm.prescriptionItem.currentRegimen = swappedObsToConcept;
            //ask for regimen input if doesn't exist
            if (swappedObsToConcept) {
              getDrugsOfRegimen(swappedObsToConcept);
            } else {
              vm.isRegimenEdit = true;
            }
          }
        });
    }

    function initArvPlans(){

      observationsService.get(patientUuid, Bahmni.Common.Constants.drugPrescriptionConvSet.artPlan.uuid)
        .success(function (data) {
          var nonRetired = commonService.filterRetired(data.results);
          var maxObs = _.maxBy(nonRetired, 'obsDatetime');

          if (maxObs) {
            var swappedObsToConcept = swapObsToConceptAnswer(maxObs.value.uuid, vm.fieldModels.artPlan.model.answers);
            vm.prescriptionItem.arvPlan = swappedObsToConcept;
            vm.isArvPlanEdit = !swappedObsToConcept;
          }
        });
    }

    function getDrugsOfRegimen(regime) {
      drugService.getDrugsOfRegimen(regime).then( function (drugs) {
        vm.arvDrugs = drugs;
      });
    }

    function swapObsToConceptAnswer(obs, conceptAnswers) {
      return _.find(conceptAnswers, function (answer) {
        return obs === answer.uuid;
      });
    }

    function getCancellationModal() {
      return angular.element('#cancelPrescriptionModal');
    }

    function getProviderAndPrescriptionDateModal() {
      return angular.element('#addProviderAndPrescriptionDateModel');
    }

  }

})();

