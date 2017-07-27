(function () {
  'use strict';

  angular
    .module('pharmacy')
    .controller('DispensationController', DispensationController);

  DispensationController.$inject = ['$rootScope', 'dispensationService', 'prescriptionService', 'localStorageService'];

  function DispensationController($rootScope, dispensationService, prescriptionService, localStorageService) {

    var dateUtil = Bahmni.Common.Util.DateUtil;

    var vm = this;
    vm.itemIndex = 0;
    vm.prescriptiontNoResultsMessage = "PHARMACY_LIST_NO_ITEMS";
    vm.prescriptions = [];
    vm.prescription = {};
    vm.selectedItems = [];
    vm.today = dateUtil.getDateWithoutTime(dateUtil.now());

    vm.initPrescriptions = initPrescriptions;
    vm.dispense = dispense;
    vm.remove = remove;
    vm.select = select;
    vm.updatePickUp = updatePickUp;

    activate();

    ////////////////

    function activate() {
      updateDispenseListMessage();
    }


    function initPrescriptions() {

      var patientUuid = $rootScope.patient.uuid;

      prescriptionService.getPatientNonDispensedPrescriptions(patientUuid).then(function (patientPrescriptions) {

        vm.prescriptions = [];
        vm.prescription = {};

        if(patientPrescriptions.length > 0){
          vm.prescriptions = _.flatMap(patientPrescriptions, 'prescriptionItems');
          vm.prescription = patientPrescriptions[0];
        }

        vm.prescriptiontNoResultsMessage = _.isEmpty(vm.prescriptions) ? "PHARMACY_LIST_NO_ITEMS" : null;
      });
    }


    function select(item) {
      if (!item.disable) {
        setSelectedItem(item);
        setDefaultArvData(item);
        selectOtherDrugWithSomeRegime(item);
      }
    }


    function setSelectedItem(item) {
      item.disable = true;
      vm.selectedItems.push(item);
      updateDispenseListMessage();
    }


    function setDefaultArvData(item) {
      if (item.regime) {
        item.showNextPickupDate = true;
        item.quantity = 1;
        item.nextPickupDate = new Date();
      }
    }


    function selectOtherDrugWithSomeRegime(item) {

      _.forEach(vm.prescriptions, function (selectedItem) {

        if (!selectedItem.disable) {
          if (item.regime && selectedItem.regime) {
            if (item.regime.uuid === selectedItem.regime.uuid) {
              setSelectedItem(selectedItem);
              setDefaultArvData(selectedItem);
            }
          }
        }
      });
    }


    function remove(item) {
      setRemovedItem(item);
      removeSimilarArvRegimeDrug(item);
    }


    function setRemovedItem(item) {
      item.disable = false;
      _.pull(vm.selectedItems, item);
      item.quantity = null;
      item.nextPickupDate = null;
      updateDispenseListMessage();
    }


    function removeSimilarArvRegimeDrug(item) {

      _.forEach(vm.selectedItems, function (selectedItem) {

        if (selectedItem.disable) {
          if (item.regime && selectedItem.regime) {
            if (item.regime.uuid === selectedItem.regime.uuid) {
              setRemovedItem(selectedItem);
            }
          }
        }
      });
    }


    function updatePickUp(item) {
      setUpdatePickUp(item);
      setUpdatePickUpForSimilarDrugRegime(item);
    }


    function setUpdatePickUp(item) {

      if (item.quantity > item.drugToPickUp) {
        item.quantity = item.drugToPickUp;
      }

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


    function setUpdatePickUpForSimilarDrugRegime(item) {

      var minumumQuantity = item.quantity;

      var itemComparison = item;

      _.forEach(vm.selectedItems, function (selectedItem) {

        if (itemComparison.regime && selectedItem.regime) {

          if (itemComparison.regime.uuid === selectedItem.regime.uuid) {

            selectedItem.quantity = itemComparison.quantity;
            setUpdatePickUp(selectedItem);

            if (selectedItem.quantity > itemComparison.quantity) {

              selectedItem.quantity = itemComparison.quantity;
              setUpdatePickUp(selectedItem);
            }
            else if (selectedItem.quantity < itemComparison.quantity) {

              itemComparison.quantity = selectedItem.quantity;
              setUpdatePickUp(itemComparison);

            }
          }
        }
      });
    }


    function dispense() {

      var dispensation = {

        providerUuid: $rootScope.currentUser.person.uuid,
        patientUuid: $rootScope.patient.uuid,
        locationUuid: localStorageService.cookie.get("emr.location").uuid,
        prescriptionEncounter: vm.prescription.prescriptionEncounter,

        dispensationItems: []
      };

      _.forEach(vm.selectedItems, function (item) {

        var dispensationItem = {

          orderUuid: item.drugOrder.uuid,
          quantityToDispense: item.quantity ? item.quantity : item.drugOrder.quantity,
          quantityDispensed: item.drugPickedUp,
          dateOfNextPickUp: item.nextPickupDate,
          regimeUuid: (item.regime) ? item.regime.uuid : null
        };

        dispensation.dispensationItems.push(dispensationItem);
      });

      dispensationService.createDispensation(dispensation).then(function (dispensationUUID) {
        vm.selectedItems = [];
        updateDispenseListMessage();
        initPrescriptions();
      });
    }

    function updateDispenseListMessage() {
      vm.dispenseListNoResultsMessage = vm.selectedItems.length === 0 ? "PHARMACY_LIST_NO_ITEMS" : null;
    }
  }
})();
