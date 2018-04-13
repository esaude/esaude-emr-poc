(function () {
  'use strict';

  angular
    .module('pharmacy')
    .controller('DispensationController', DispensationController);

  DispensationController.$inject = ['$filter', '$stateParams', 'dispensationService', 'localStorageService',
    'notifier', 'prescriptionService', 'sessionService', 'spinner'];

  function DispensationController($filter, $stateParams, dispensationService, localStorageService, notifier,
                                  prescriptionService, sessionService, spinner) {

    var dateUtil = Bahmni.Common.Util.DateUtil;

    var currentUser = {};
    var patientUUID = $stateParams.patientUuid;

    var vm = this;
    vm.invalidQty = false;
    vm.prescriptions = [];
    vm.selectedPrescriptionItems = [];
    vm.today = dateUtil.getDateWithoutTime(dateUtil.now());

    vm.dispense = dispense;
    vm.remove = remove;
    vm.select = select;
    vm.toggleVisibility = toggleVisibility;
    vm.updatePickup = updatePickup;

    activate();

    ////////////////

    function activate() {
      var load = getCurrentUser().then(function (user) {
        currentUser = user;
        return initPrescriptions();
      });

      spinner.forPromise(load);
    }


    function initPrescriptions() {
      return getPatientNonDispensedPrescriptions(patientUUID).then(function (prescriptions) {
        vm.prescriptions = prescriptions;
        vm.prescriptions.slice(1).forEach(function (p) {
          p.hidden = true;
        });
      });
    }


    function remove(item) {
      if (!item.selected) {
        return;
      }

      var sameRegimeItems = [item].concat(getSameRegimeItems(vm.selectedPrescriptionItems, item));

      sameRegimeItems.forEach(function (i) {
        i.selected = false;
        i.quantity = null;
        i.nextPickupDate = null;
      });

      _.pullAll(vm.selectedPrescriptionItems, sameRegimeItems);
    }


    function select(prescription, item) {
      if (item.selected) {
        return;
      }

      if(hasActivePreviousDispensed(item)){
        notifier.error($filter('translate')('PHARMACY_CANNOT_DISPENSE_FOR_NOT_EXPIRED_PREVIOUS_DISPENSATION', { drugName: item.display, expirationDate: item.nextPickupDate.toDateString()}));
        return;
      }
      var sameRegimeItems = [item].concat(getSameRegimeItems(prescription.prescriptionItems, item));

      sameRegimeItems.forEach(function (i) {
        i.selected = true;
        i.prescription = prescription;
        i.nextPickupDate = new Date();
        i.showNextPickupDate = true;
        i.quantity = 1;
        updatePickupDate(i);
      });

      vm.selectedPrescriptionItems = vm.selectedPrescriptionItems.concat(sameRegimeItems);
    }


    function toggleVisibility(prescription) {
      vm.prescriptions.forEach(function (p) {
        if (p === prescription) {
          p.hidden = !p.hidden;
        } else {
          p.hidden = true;
        }
      });
    }


    function updatePickup(item) {

      var sameRegimeItems = [item].concat(getSameRegimeItems(vm.selectedPrescriptionItems, item));

      var minAvailable = sameRegimeItems.reduce(function (min, i) {
        return min.drugToPickUp > i.drugToPickUp ? i : min;
      });

      if (item.quantity > minAvailable.drugToPickUp) {
        item.quantity = minAvailable.drugToPickUp;
        notifier.info($filter('translate')('PHARMACY_CANNOT_DISPENSE_MORE_THAN_AVAILABLE', {
          availableQty: minAvailable.drugToPickUp
        }));
      }

      sameRegimeItems.forEach(function (i) {
        i.quantity = item.quantity;
        updatePickupDate(i);
      });
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

      if (item.quantity >= twoDays) {
        numberOfPillsMinusTwoDays -= twoDays;
      }

      item.nextPickupDate = new Date(today.getTime() + (oneDayInMilSec * numberOfPillsMinusTwoDays));

      while (item.nextPickupDate.getDay() === sunday || item.nextPickupDate.getDay() === saturday) {
        item.nextPickupDate = new Date(item.nextPickupDate.getTime() - oneDayInMilSec);
      }
    }


    function dispense() {
      //--- TODO: this should be inside dispensationService
      var items = vm.selectedPrescriptionItems.map(function (i) {
        return {
          orderUuid: i.drugOrder.uuid,
          quantityToDispense: i.quantity ? i.quantity : i.drugOrder.quantity,
          quantityDispensed: i.drugPickedUp,
          dateOfNextPickUp: i.nextPickupDate,
          regimeUuid: (i.regime) ? i.regime.uuid : null,
          prescriptionUuid: i.prescription.prescriptionEncounter.uuid
        }
      });

      var dispensation = {
        providerUuid: currentUser.person.uuid,
        patientUuid: patientUUID,
        locationUuid: sessionService.getCurrentLocation().uuid,
        dispensationItems: items
      };
      //---
      dispensationService.createDispensation(dispensation).then(function (dispensationUUID) {
        notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
        vm.selectedPrescriptionItems = [];
        initPrescriptions();
      }).catch(function (error) {
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
      resultDate.setHours(0,0,0,0)
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


    function getPatientNonDispensedPrescriptions(patientUUID) {
      return prescriptionService
        .getPatientNonDispensedPrescriptions(patientUUID)
        .catch(errorHandler);
    }


    function getSameRegimeItems(list, item) {
      return list.filter(function (i) {
        return item.regime && i.regime
          && item.regime.uuid === i.regime.uuid
          && item !== i;
      });
    }
  }
})();
