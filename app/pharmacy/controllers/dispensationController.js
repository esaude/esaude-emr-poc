(function () {
  'use strict';

  angular
    .module('pharmacy')
    .controller('DispensationController', DispensationController);

  DispensationController.$inject = ['$filter', '$stateParams', 'dispensationService', 'localStorageService',
    'notifier', 'prescriptionService', 'sessionService', 'patientService'];

  function DispensationController($filter, $stateParams, dispensationService, localStorageService, notifier,
                                  prescriptionService, sessionService, patientService) {

    var dateUtil = Bahmni.Common.Util.DateUtil;

    var currentUser = {};
    var patientUUID = $stateParams.patientUuid;

    var vm = this;
    vm.invalidQty = false;
    vm.patient = {};
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
      getCurrentUser().then(function (user) {
        currentUser = user;
        return initPrescriptions();
      });

      patientService.getPatient(patientUUID)
        .then(function (patient) {
          vm.patient = patient;
        })
        .catch(errorHandler)
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
      item.quantity = item.drugToPickUp;
      updatePickupDate(item);

      vm.selectedPrescriptionItems = vm.selectedPrescriptionItems.concat([item]);
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

  }
})();
