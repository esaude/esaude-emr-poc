(function () {
  'use strict';

  angular
    .module('pharmacy')
    .controller('DispensationController', DispensationController);

  DispensationController.$inject = ['$rootScope', 'dispensationService', 'prescriptionService', 'localStorageService'];

  function DispensationController($rootScope, dispensationService, prescriptionService, localStorageService) {

    var dateUtil = Bahmni.Common.Util.DateUtil;
    // TODO: use sessionService to get current user
    var currentUser = $rootScope.currentUser;
    // TODO: get patient from route param
    var patient = $rootScope.patient;

    var vm = this;
    vm.prescriptions = [];
    vm.selectedPrescriptionItems = [];
    vm.today = dateUtil.getDateWithoutTime(dateUtil.now());

    vm.dispense = dispense;
    vm.remove = remove;
    vm.select = select;
    vm.updatePickup = updatePickup;

    activate();

    ////////////////

    function activate() {
      initPrescriptions();
    }


    function initPrescriptions() {

      var patientUuid = $rootScope.patient.uuid;

      prescriptionService
        .getPatientNonDispensedPrescriptions(patientUuid).then(function (prescriptions) {
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

      var sameRegimeItems = [item].concat(getSameRegimeItems(prescription.prescriptionItems, item));

      sameRegimeItems.forEach(function (i) {
        i.selected = true;
        i.prescription = prescription;
        if (i.regime) {
          i.nextPickupDate = new Date();
          i.showNextPickupDate = true;
          i.quantity = 1;
        }
      });

      vm.selectedPrescriptionItems = vm.selectedPrescriptionItems.concat(sameRegimeItems);
    }


    function updatePickup(item) {

      var sameRegimeItems = [item].concat(getSameRegimeItems(vm.selectedPrescriptionItems, item));

      var minAvailable = sameRegimeItems.reduce(function (min, i) {
        return min.drugToPickUp > i.drugToPickUp ? i : min;
      });

      item.quantity = Math.min(item.quantity, minAvailable.drugToPickUp);

      sameRegimeItems.forEach(function (i) {
        i.quantity = item.quantity;
        updatePickupDate(i);
      });
    }


    function updatePickupDate(item) {

      var twoDays = 2;
      var sunday = 0;
      var saturday = 6;

      var today = new Date();
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
        patientUuid: patient.uuid,
        locationUuid: localStorageService.cookie.get("emr.location").uuid,
        dispensationItems: items
      };
      //---
      dispensationService.createDispensation(dispensation).then(function (dispensationUUID) {
        vm.selectedPrescriptionItems = [];
        initPrescriptions();
      });
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
