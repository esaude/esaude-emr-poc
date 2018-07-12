/**
 * A component for handling drug prescriptions.
 */
(function () {
  'use strict';

  angular
    .module('poc.common.prescription')
    .component('prescription', {
      bindings: {
        patient: '<',
        retrospectiveMode: '<',
      },
      controller: PrescriptionController,
      controllerAs: 'vm',
      templateUrl: '../common/prescription/components/prescription.html',
    });

  /* @ngInject */
  function PrescriptionController($http, $filter, $q, $stateParams, $uibModal, observationsService,
                                  commonService, conceptService, localStorageService, notifier,
                                  drugService, prescriptionService, providerService, sessionService) {

    var vm = this;
    vm.arvDrugs = [];
    vm.existingPrescriptions = [];
    vm.prescriptionConvSet = {};
    vm.listedPrescriptions = [];
    vm.regimen = {};
    vm.prescriptionDate = null;
    vm.prescriptionItem = {};
    vm.selectedProvider = { display: '' };
    vm.showMessages = false;
    vm.showNewPrescriptionsControlls = false;

    vm.$onInit = $onInit;
    vm.onArtPlanChange = onArtPlanChange;
    vm.add = add;
    vm.cancelOrStop = cancelOrStop;
    vm.checkDrugType = checkDrugType;
    vm.cleanDrugIfUnchecked = cleanDrugIfUnchecked;
    vm.onDrugRegimenChange = onDrugRegimenChange;
    vm.edit = edit;
    vm.getDrugs = getDrugs;
    vm.refill = refill;
    vm.removeAll = removeAll;
    vm.remove = remove;
    vm.reset = reset;
    vm.save = save;
    vm.checkActiveAndNewItemStatus = checkActiveAndNewItemStatus;
    vm.checkItemIsRefillable = checkItemIsRefillable;
    vm.verifyDrugAvailability = verifyDrugAvailability;
    vm.searchProviders = searchProviders;
    vm.onTherapeuticLineChange = onTherapeuticLineChange;

    ////////////////

    function $onInit() {

      if (vm.retrospectiveMode) {
        vm.prescriptionDate = new Date();
      }

      sessionService.getCurrentProvider()
        .then(currentProvider => {
          if (!vm.retrospectiveMode) {
            vm.selectedProvider = currentProvider;
          }
        })
        .catch(() => {
          notifier.error($filter('translate')('COMMON_ERROR'));
        });

      prescriptionService.getPrescriptionConvSetConcept()
        .then(c => vm.prescriptionConvSet = c);

      prescriptionService.getPatientRegimen(vm.patient)
        .then(regimen => {
          vm.regimen = regimen;
          loadDrugRegimenDrugs(regimen.drugRegimen);
        })
        .catch(() => {
          notifier.error($filter('translate')('COMMON_ERROR'));
        });

      loadSavedPrescriptions(vm.patient);
    }

    function add(form) {
      if (!form.$valid) {
        vm.showMessages = true;
        return;
      }

      if(!validateAddItem()){
        return;
      }

      //avoid duplication of drugs
      var sameOrderItem = _.find(vm.listedPrescriptions, item => item.drugOrder.drug.uuid === vm.prescriptionItem.drugOrder.drug.uuid);

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

      var prescription = {prescriptionItems: [vm.prescriptionItem]};
      if (hasActiveArvPrescriptionForNewArvItem(prescription)) {
        notifier.error($filter('translate')('COMMON_MESSAGE_COULD_NOT_ADD_ITEM_ARV_BECAUSE_EXISTS_AN_ACTIVE_ARV_PRESCRIPTION', {EXISTING_ITEM: vm.prescriptionItem.drugOrder.drug.display}));
        return false;
      }

      if (!_.isEmpty(getDuplicatedExistingActivePrescriptionItems(prescription))) {
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

        drugService.isArvDrug(drug).then(isArv => {
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
        verifyDrugAvailability(drug);
      }
    }

    function loadDrugRegimenDrugs(drugRegimen) {
      drugService.getDrugsOfRegimen(drugRegimen).then(drugs => {
        vm.arvDrugs = drugs;
      });
    }

    function onArtPlanChange(artPlan) {
      vm.regimen.artPlan = artPlan;
    }

    function onTherapeuticLineChange(therapeuticLine) {
      vm.regimen.therapeuticLine = therapeuticLine;
    }

    function onDrugRegimenChange(drugRegimen, changeReason) {
      vm.regimen.drugRegimen = drugRegimen;
      vm.regimen.changeReason = changeReason;
      loadDrugRegimenDrugs(vm.regimen.drugRegimen);
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
        .then(response => response.data.results.map(drug => drug));
    }


    function openPrescriptionDateAndProviderModal() {
      var modalInstance = $uibModal.open({component: 'dateAndProviderModal'});
      return modalInstance.result;
    }

    function refill(item) {
      var refill = $q.resolve();
      var item = angular.copy(item);

      if (vm.retrospectiveMode) {
        refill = openPrescriptionDateAndProviderModal()
          .then(({date, provider}) => {
            vm.selectedProvider = provider;
            vm.prescriptionDate = date;
          });
          // Do nothing if modal closed
      }

      refill
        .then(() => {
          item.drugOrder.dosingInstructions = {uuid: item.drugOrder.dosingInstructions};
          if (item.regime) {
            item.isArv = true;
          }
          vm.listedPrescriptions.push(item);
          vm.showNewPrescriptionsControlls = true;
        });
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

    function save(form) {

      var prescription = {
        patient: {uuid: vm.patient.uuid},
        provider: {uuid: vm.selectedProvider && vm.selectedProvider.uuid},
        location: {uuid: sessionService.getCurrentLocation().uuid},
        prescriptionItems: []
      };

      if (vm.retrospectiveMode) {
        prescription.prescriptionDate = vm.prescriptionDate;
      }

      _.forEach(vm.listedPrescriptions, element => {
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
        };
        prescription.regime = element.isArv ? element.regime : null;
        prescription.therapeuticLine =  element.isArv ? element.therapeuticLine : null;
        prescription.arvPlan =  (element.isArv && element.arvPlan) ? element.arvPlan : null;
        prescription.interruptionReason = (element.isArv && element.interruptedReason) ? element.interruptedReason : null;
        prescription.changeReason = (element.isArv && element.changeReason ) ? element.changeReason : null;
        prescription.prescriptionItems.push(prescriptionItem);
      });


      if(validateCreatePrescription(form, prescription)){

        prescriptionService.create(prescription)
          .then(() => {
            notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
            vm.listedPrescriptions = [];
            resetSelectedProvider();
            isPrescriptionControl();
            loadSavedPrescriptions(vm.patient);
          })
          .catch(error => {
            notifier.error(error.data.error.message.replace('[','').replace(']',''));
          });
      }
      else{
        resetSelectedProvider();
      }
    }

    function resetSelectedProvider() {
      if (vm.retrospectiveMode) {
        vm.selectedProvider = { display: '' };
      }
    }

    function validateCreatePrescription(form, prescription){

      if(form.selectedProvider && form.selectedProvider.$invalid)
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
      _.forEach(prescription.prescriptionItems, newPrescriptionItem => {
        if(newPrescriptionItem.regime){
          _.forEach(vm.existingPrescriptions, existingPrescription => {
            _.forEach(existingPrescription.prescriptionItems, prescriptionItem => {
              if(isActiveARVItem(prescriptionItem)){
                exists = true;
              }
            });
          });
        }
      });
      return exists;
    }

    function isActiveARVItem(item) {
      return  item.regime && (item.status ==='NEW' || item.status ==='ACTIVE' ||item.status ==='FINALIZED');
    }

    function getDuplicatedExistingActivePrescriptionItems(prescription) {
      var hasDuplicated = [];
      _.forEach(prescription.prescriptionItems, newPrescriptionItem => {
        _.forEach(vm.existingPrescriptions, existingPrescription => {
          _.forEach(existingPrescription.prescriptionItems, prescriptionItem => {
            if( prescriptionItem.status != 'FINALIZED' &&  prescriptionItem.status != 'EXPIRED' &&  prescriptionItem.status != 'INTERRUPTED' ){
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
          vm.prescriptionItem.regime = null;
          vm.prescriptionItem.arvPlan = null;
        }
      }
    }

    function openCancelPrescriptionModal(item) {
      return $uibModal.open({
        component: 'cancelPrescriptionModal',
        resolve: {
          prescriptionItemToCancel: () => item,
          cancellationReasons: () => vm.prescriptionConvSet.interruptedReason.answers,
        }
      }).result;
    }

    function stopPrescriptionItem(item, reason) {
      prescriptionService.stopPrescriptionItem(item.drugOrder, reason)
        .then(() => {
          notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
          vm.listedPrescriptions = [];
          isPrescriptionControl();
          loadSavedPrescriptions(vm.patient);
        })
        .catch(() => {
          notifier.error($filter('translate')('COMMON_MESSAGE_COULD_NOT_CANCEL_PRESCRIPTION_ITEM'));
        });
    }

    function cancelOrStop(item){
      openCancelPrescriptionModal(item)
        .then(({cancellationReason}) => {
          var reason = (item.drugOrder.action ==='NEW') ? cancellationReason : cancellationReason.uuid;
          stopPrescriptionItem(item, reason);
        });
        // Do nothing if modal closed
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
      return prescriptionService.getAllPrescriptions(patient)
        .then(patientPrescriptions => {
          vm.existingPrescriptions = _.sortBy(patientPrescriptions, ['prescriptionStatus', 'prescriptionDate'], ['asc', 'desc']);
        });
    }

    function checkActiveAndNewItemStatus(item){
      return item.status === 'ACTIVE' || item.status === 'NEW';
    }

    function checkItemIsRefillable(prescription){
      return prescription.prescriptionStatus === 'FINALIZED' || prescription.prescriptionStatus === 'EXPIRED';
    }

    function verifyDrugAvailability(drug){
      drugService.getDrugStock(drug,sessionService.getCurrentLocation()).then(data => {
        if(_.isEmpty(data.results)){
         notifier.warning($filter('translate')('COMMON_MESSAGE_DRUG_WITHOUT_STOCK_AVAILABILITY'));
        }
      }).catch(() => {
        notifier.error($filter('translate')('COMMON_MESSAGE_EXCEPTION_REQUESTING_DRUG_STOCK_AVAILABILITY'));
      });
    }

    function searchProviders(term) {
      return providerService.getProviders(term)
        .catch(() => {
          notifier.error($filter('translate')('COMMON_ERROR'));
        });
    }
  }

})();

