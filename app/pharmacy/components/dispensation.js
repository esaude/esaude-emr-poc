(function () {
  'use strict';

  angular
    .module('pharmacy')
    .component('dispensation', {
      bindings: {
        patient: '<'
      },
      controller: DispensationController,
      controllerAs: 'vm',
      templateUrl: '../pharmacy/components/dispensation.html'
    });

  /* @ngInject */
  function DispensationController($filter, dispensationService, notifier, prescriptionService, sessionService, drugService) {

    var dateUtil = Bahmni.Common.Util.DateUtil;

    var currentUser = {};

    var vm = this;
    vm.invalidQty = false;
    vm.prescriptions = [];
    vm.selectedPrescriptionItems = [];
    vm.today = dateUtil.getDateWithoutTime(dateUtil.now());

    vm.$onInit = $onInit;
    vm.dispense = dispense;
    vm.remove = remove;
    vm.select = select;
    vm.toggleVisibility = toggleVisibility;
    vm.updatePickup = updatePickup;

    function $onInit() {
      getCurrentUser().then(user => {
        currentUser = user;
        return initPrescriptions();
      });
    }


    function initPrescriptions() {
      return getPatientNonDispensedPrescriptions(vm.patient).then(prescriptions => {
        vm.prescriptions = prescriptions;
        vm.prescriptions.slice(1).forEach(p => {
          p.hidden = true;
        });
      });
    }


    function remove(item) {
      if (!item.selected) {
        return;
      }

      item.selected = false;
      item.quantity = null;
      item.nextPickupDate = null;

      _.pullAll(vm.selectedPrescriptionItems, [item]);
    }


    function select(prescription, item) {
      if (item.selected) {
        return;
      }

      if(item.regime && hasActivePreviousDispensed(item)){
        notifier.error($filter('translate')('PHARMACY_CANNOT_DISPENSE_FOR_NOT_EXPIRED_PREVIOUS_DISPENSATION', { drugName: item.display, expirationDate: item.nextPickupDate.toDateString()}));
        return;
      }
      item.selected = true;
      item.prescription = prescription;
      item.nextPickupDate = new Date();
      item.showNextPickupDate = true;
      item.quantity = dispensationService.getDefaultItemQuantityToDispense(item);
      updatePickupDate(item);
      vm.selectedPrescriptionItems = vm.selectedPrescriptionItems.concat([item]);
    }
    
    function toggleVisibility(prescription) {
      vm.prescriptions.forEach(p => {
        if (p === prescription) {
          p.hidden = !p.hidden;
        } else {
          p.hidden = true;
        }
      });
    }

    function updatePickup(item) {

      if (item.quantity > item.drugToPickUp) {
        item.quantity = item.drugToPickUp;
        notifier.info($filter('translate')('PHARMACY_CANNOT_DISPENSE_MORE_THAN_AVAILABLE', {
          availableQty: item.drugToPickUp
        }));
      }
      updatePickupDate(item);
    }

    function updatePickupDate(item) {

      var twoDays = 2;
      var sunday = 0;
      var saturday = 6;

      var today =  (item.expectedNextPickUpDate) ? new Date(item.expectedNextPickUpDate) : new Date();
      var numberOfPillsMinusTwoDays = item.quantity;
      var oneDayInMilSec = 1000 * 60 * 60 * 24;

      if (!item.quantity) {
        item.nextPickupDate = today;
        return;
      }

      if (item.status === "NEW" && item.quantity > twoDays) {
        numberOfPillsMinusTwoDays -= twoDays;
      }

      if (item.status === "NEW" && item.quantity === twoDays) {
        numberOfPillsMinusTwoDays -= 1;
      }

      item.nextPickupDate = new Date(today.getTime() + (oneDayInMilSec * numberOfPillsMinusTwoDays));

      while (item.nextPickupDate.getDay() === sunday || item.nextPickupDate.getDay() === saturday) {
        item.nextPickupDate = new Date(item.nextPickupDate.getTime() - oneDayInMilSec);
      }
    }


    function dispense() {
      //--- TODO: this should be inside dispensationService
      var items = vm.selectedPrescriptionItems.map(i => ({
        orderUuid: i.drugOrder.uuid,
        quantityToDispense: i.quantity ? i.quantity : i.drugOrder.quantity,
        quantityDispensed: i.drugPickedUp,
        dateOfNextPickUp: i.nextPickupDate,
        regimeUuid: (i.regime) ? i.regime.uuid : null,
        prescriptionUuid: i.prescription.prescriptionEncounter.uuid
      }));

      var dispensation = {
        providerUuid: currentUser.person.uuid,
        patientUuid: vm.patient.uuid,
        locationUuid: sessionService.getCurrentLocation().uuid,
        dispensationItems: items
      };
      //---
      dispensationService.createDispensation(dispensation).then(dispensationUUID => {
        notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
        vm.selectedPrescriptionItems = [];
        initPrescriptions();
      }).catch(error => {
        notifier.error(error.data.error.message.replace('[','').replace(']',''));
      });
    }

    function hasActivePreviousDispensed(item){
      if(!item.drugPickedUp || item.drugPickedUp <=0 ){
        return false;
      }
      updatePickupDate(item);
      var today = getPredfinedDateWithoutTime(new Date());
      var nextPickupDate =  getPredfinedDateWithoutTime(item.nextPickupDate);
      if(today >= nextPickupDate){
        return false;
      }
      return true;
    }

    function getPredfinedDateWithoutTime(myDate) {
      var resultDate = angular.copy(myDate);
      resultDate.setHours(0,0,0,0);
      return resultDate;
  }

    function errorHandler() {
      notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
    }


    function getCurrentUser() {
      return sessionService
        .getCurrentUser()
        .catch(errorHandler);
    }

    function getPatientNonDispensedPrescriptions(patient) {
      return prescriptionService
        .getPatientNonDispensedPrescriptions(patient.uuid)
        .catch(errorHandler);
    }

  }
})();
