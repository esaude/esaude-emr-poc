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
    vm.drugAvailable = true;
    vm.existingPrescriptions = [];
    vm.prescriptionConvSet = {};
    vm.prescription = {items: [], arvItems: []};
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
    vm.isRegimenEditable = isRegimenEditable;
    vm.onArvRegimenChange = onArvRegimenChange;
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

      loadSavedPrescriptions(vm.patient);
    }

    function isRegimenEditable() {
      return vm.prescription.items.length === 0 || angular.isUndefined(vm.prescription.regimen);
    }

    function setRegimen(regimen) {
      vm.regimen = regimen;
      vm.regimen.isArv = !!regimen.artPlan;
      if (regimen.drugRegimen) {
        loadDrugRegimenDrugs(regimen.drugRegimen);
      }
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
      var sameOrderItem = _.find(vm.prescription.items, item => item.drugOrder.drug.uuid === vm.prescriptionItem.drugOrder.drug.uuid);

      if (sameOrderItem) {
        notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ITEM_ALREADY_IN_LIST'));
        return;
      }
      if (vm.regimen.isArv) {
        vm.prescription.arvItems.push(vm.prescriptionItem);
        vm.prescription.regimen = vm.regimen;
      }
      vm.prescription.items.push(vm.prescriptionItem);
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

        drugService.isArvDrug(drug, {ignoreLoadingBar: true})
          .then(isArv => {
            if (isArv) {
              vm.regimen.isArv = true;
              // TODO load therapeuticline, drugRegimen and artPlan
              vm.prescriptionItem.drugOrder = null;
            } else {
              vm.prescriptionItem.isArv = false;
              vm.prescriptionItem.interruptedReason = {};
              vm.prescriptionItem.isPlanInterrupted = false;
              vm.prescriptionItem.arvPlan = {};
            }
          });
          // Don't handle error for non arv drugs
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
      _.pull(vm.prescription.items, item);
      isPrescriptionControl();
    }

    function getDrugs(request) {
      if (request.length < 3) return;

      return $http.get(Bahmni.Common.Constants.drugResourceUrl, {
        params: {
          q: request,
          v: "full",
          ignoreLoadingBar: true,
        }
      })
        .then(response => response.data.results.map(drug => drug));
    }


    function openPrescriptionDateAndProviderModal() {
      const modalInstance = $uibModal.open({
        component: 'dateAndProviderModal',
        resolve: {
          prescriptionDate: () => vm.prescriptionDate,
          selectedProvider: () => vm.selectedProvider,
        }
      });
      return modalInstance.result;
    }

    function refill(prescription, item) {
      const i = angular.copy(item);
      const regimen = {
        drugRegimen: prescription.regime,
        therapeuticLine: prescription.therapeuticLine,
        artPlan: prescription.arvPlan,
      };
      if (prescription.arvPlan) {
        setRegimen(regimen);
      }
      i.drugOrder.dosingInstructions = {uuid: i.drugOrder.dosingInstructions};
      vm.prescription.items.push(i);
      vm.showNewPrescriptionsControlls = true;
    }


    function remove(item) {
      _.pull(vm.prescription.items, item);
      _.pull(vm.prescription.arvItems, item);
      if (vm.prescription.arvItems.length === 0) {
        vm.prescription.regimen = null;
      }
      isPrescriptionControl();
    }

    function removeAll() {
      vm.regimen = {};
      vm.prescription.items = [];
      vm.prescription.regimen = null;
      isPrescriptionControl();
    }


    function reset(form) {
      resetForm(form);
    }

    function save() {

      let setDateAndProvider = $q.resolve();

      if (vm.retrospectiveMode && (!vm.prescriptionDate || vm.selectedProvider.display === '')) {
        setDateAndProvider = openPrescriptionDateAndProviderModal()
          .then(({date, provider}) => {
            vm.selectedProvider = provider;
            vm.prescriptionDate = date;
          });
        // Do nothing if modal closed
      }

      setDateAndProvider
        .then(() => _save());
    }

    function _save() {
      var prescription = {
        patient: {uuid: vm.patient.uuid},
        provider: {uuid: vm.selectedProvider && vm.selectedProvider.uuid},
        location: {uuid: sessionService.getCurrentLocation().uuid},
        prescriptionItems: [],
        regime: vm.prescription.regimen && {uuid: vm.prescription.regimen.drugRegimen.uuid},
        therapeuticLine: vm.prescription.regimen && {uuid: vm.prescription.regimen.therapeuticLine.uuid},
        arvPlan: vm.prescription.regimen && {uuid: vm.prescription.regimen.artPlan.uuid},
        interruptionReason: vm.prescription.regimen && vm.prescription.regimen.interruptedReason && {uuid: vm.prescription.regimen.interruptedReason.uuid},
        changeReason: vm.prescription.regimen && vm.prescription.regimen.interruptedReason && {uuid: vm.prescription.regimen.changeReason.uuid},
      };

      if (vm.retrospectiveMode) {
        prescription.prescriptionDate = vm.prescriptionDate;
      }

      _.forEach(vm.prescription.items, element => {
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
        prescription.prescriptionItems.push(prescriptionItem);
      });


      if(validateCreatePrescription(prescription)){

        prescriptionService.create(prescription)
          .then(() => {
            notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
            vm.prescription.items = [];
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

    function validateCreatePrescription(prescription) {

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

    function loadPatientRegimen() {
      prescriptionService.getPatientRegimen(vm.patient)
        .then(regimen => {
          setRegimen(regimen);
        })
        .catch(() => {
          notifier.error($filter('translate')('COMMON_ERROR'));
        });
    }

    function onArvRegimenChange() {
      if (vm.regimen.isArv) {
        loadPatientRegimen();
      }
      if (!vm.prescriptionItem.isArv && vm.prescriptionItem && vm.prescriptionItem.drugOrder) {
        vm.prescriptionItem.drugOrder.drug = null;
      }
      vm.drugAvailable = true;
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
          vm.prescription.items = [];
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
      vm.regimen = {};
      vm.prescriptionItem = {};
    }


    function isPrescriptionControl() {
      if (_.isEmpty(vm.prescription.items)) {
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

    function isSameDrugRegimen(prescription) {
      return vm.regimen.drugRegimen && vm.regimen.drugRegimen.uuid === prescription.regime.uuid;
    }

    function checkItemIsRefillable(prescription, item) {
      const contained = vm.prescription.items.find((p) => p.drugOrder.drug.uuid === item.drugOrder.drug.uuid);
      if (contained) {
        return false;
      }
      const ended = prescription.prescriptionStatus === 'FINALIZED' || prescription.prescriptionStatus === 'EXPIRED';
      if (prescription.regime && vm.prescription.items.length) {
          return ended && isSameDrugRegimen(prescription);
      } else {
        return ended;
      }
    }

    function verifyDrugAvailability(drug) {
      if (drug) {
        vm.checkingAvailability = true;
        drugService.isDrugAvailable(drug, {ignoreLoadingBar: true})
          .then(available => vm.drugAvailable = available)
          .catch(() => {
            notifier.error($filter('translate')('COMMON_MESSAGE_EXCEPTION_REQUESTING_DRUG_STOCK_AVAILABILITY'));
          })
          .finally(() => vm.checkingAvailability = false);
      }
    }

    function searchProviders(term) {
      return providerService.getProviders(term)
        .catch(() => {
          notifier.error($filter('translate')('COMMON_ERROR'));
        });
    }
  }

})();

