'use strict';

angular.module('pharmacy').controller('DispensationController', DispensationController);

DispensationController.$inject = ["$scope", "$rootScope", "$filter", "dispensationService", "prescriptionService", "localStorageService",];

function DispensationController($scope, $rootScope, $filter, dispensationService, prescriptionService, localStorageService) {

    var dateUtil = Bahmni.Common.Util.DateUtil;

    (function () {
        $scope.selectedItems = [];

        //fake just for now
        $scope.itemIndex = 0;

        $scope.today = dateUtil.getDateWithoutTime(dateUtil.now());

        $scope.prescriptiontNoResultsMessage = "PHARMACY_LIST_NO_ITEMS";

        $scope.initPrescriptions = function () {

            var patientUuid = $rootScope.patient.uuid;

           prescriptionService.getPatientPrescriptions(patientUuid).then(function (prescriptions) {
                           $scope.prescriptions = prescriptions;
                           $scope.prescription = prescriptions[0];
                           $scope.prescriptiontNoResultsMessage = _.isEmpty($scope.prescriptions) ? "PHARMACY_LIST_NO_ITEMS" : null;
               });
        };

        $scope.select = function (item) {

           if(!item.disable){

               $scope.setSelectedItem(item);
               $scope.setDefaultArvData(item);
               $scope.selectOtherDrugWithSomeRegime(item);
            }
        };

        $scope.setSelectedItem = function(item){

           item.disable = true;
           $scope.selectedItems.push(item);
           $scope.updateDispenseListMessage();
        };

        $scope.setDefaultArvData = function(item){

          if (item.drugRegime) {

              item.showNextPickupDate = true;
              item.quantity = 1;
              item.nextPickupDate = new Date();
          }
        };

        $scope.selectOtherDrugWithSomeRegime = function(item){

          _.forEach($scope.prescriptions, function (selectedItem) {

              if(!selectedItem.disable)
              {
                  if( item.drugRegime && selectedItem.drugRegime){

                      if(item.drugRegime.regime.uuid == selectedItem.drugRegime.regime.uuid){
                          $scope.setSelectedItem(selectedItem);
                          $scope.setDefaultArvData(selectedItem);
                      }
                  }
              }
          });
        };

        //fake just for now

        /* TODO: Should Remove the hardedCode
        $scope.barcodeHandler = function(code) {
            // fake dcode
            var invalidDrug = 'IZONIAZID100mg';

            if(invalidDrug == code){
                toastr.error($filter('translate')('PHARMACY_THE_SELECTED_DRUG_IS_NOT_PART_OF_PRESCRIBED'), $filter('translate')('COMMON_ERROR'));
                return;
            }

            $scope.$apply(function () {

                var item = $scope.prescriptions[$scope.itemIndex];

                if( _.includes($scope.selectedItems, item) )
                    return;

                $scope.select(item);
                $scope.itemIndex++;
            });
        };
*/
        $scope.remove = function (item) {

           $scope.setRemovedItem(item);
           $scope.removeSimilarArvRegimeDrug(item);

        };

        $scope.setRemovedItem = function(item){
            item.disable = false;
            _.pull($scope.selectedItems, item);
            item.quantity = null;
            item.nextPickupDate = null;
            $scope.updateDispenseListMessage();
        };

         $scope.updateDispenseListMessage = function () {
            $scope.dispenseListNoResultsMessage = $scope.selectedItems.length === 0 ? "PHARMACY_LIST_NO_ITEMS" : null;
        };

        $scope.updateDispenseListMessage();

    })();

    $scope.removeSimilarArvRegimeDrug = function(item){

       _.forEach($scope.selectedItems, function (selectedItem) {

                    if(selectedItem.disable)
                    {
                        if( item.drugRegime && selectedItem.drugRegime){

                            if(item.drugRegime.regime.uuid == selectedItem.drugRegime.regime.uuid){

                                $scope.setRemovedItem(selectedItem);
                            }
                        }
                    }
                });

    };

    $scope.updatePickUp = function (item) {

        $scope.setUpdatePickUp(item);
        $scope.setUpdatePickUpForSimilarDrugRegime(item);
    };

    $scope.setUpdatePickUp = function(item){

          if(item.quantity > item.drugToPickUp){
                      item.quantity = item.drugToPickUp;
          }

          var twoDays = 2;
          var sunday = 0;
          var saturday = 6;

          var today = new Date();
          var numberOfPillsMinusTwoDays = item.quantity;
          var oneDayInMilSec = 1000 * 60 * 60 * 24;

          if(!item.quantity){
              item.nextPickupDate = today;
              return;
          }

          if(item.quantity >= twoDays){
              numberOfPillsMinusTwoDays -= twoDays;
          }

          item.nextPickupDate = new Date(today.getTime() + (oneDayInMilSec * numberOfPillsMinusTwoDays));

          while(item.nextPickupDate.getDay() == sunday || item.nextPickupDate.getDay() == saturday){
              item.nextPickupDate = new Date(item.nextPickupDate.getTime() - oneDayInMilSec);
          }
    };

    $scope.setUpdatePickUpForSimilarDrugRegime = function(item){

           var minumumQuantity = item.quantity;

           var itemComparison = item;

         _.forEach($scope.selectedItems, function (selectedItem) {

              if( itemComparison.drugRegime && selectedItem.drugRegime){

                  if(itemComparison.drugRegime.regime.uuid == selectedItem.drugRegime.regime.uuid){

                       selectedItem.quantity = itemComparison.quantity;
                       $scope.setUpdatePickUp(selectedItem);

                      if(selectedItem.quantity > itemComparison.quantity){

                        selectedItem.quantity = itemComparison.quantity;
                        $scope.setUpdatePickUp(selectedItem);
                      }
                      else if(selectedItem.quantity < itemComparison.quantity){

                        itemComparison.quantity = selectedItem.quantity;
                        $scope.setUpdatePickUp(itemComparison);

                      }
                  }
              }
         });

    };

    $scope.dispense = function() {

        var dispensation = {

            providerUuid : $rootScope.currentUser.person.uuid,

            patientUuid : $rootScope.patient.uuid,

            locationUuid : localStorageService.cookie.get("emr.location").uuid,

            dispensationItems : []
        };

        _.forEach($scope.selectedItems, function (item) {

            var dispensationItem = {

                orderUuid : item.drugOrder.uuid,
                quantityToDispense : item.quantity ? item.quantity : item.drugOrder.quantity,
                quantityDispensed : item.drugPickedUp,
                dateOfNextPickUp : item.nextPickupDate,
                prescriptionUuid : item.drugOrder.encounter.uuid,
                regimeUuid :(item.drugRegime) ? item.drugRegime.regime.uuid : null
            };

            dispensation.dispensationItems.push(dispensationItem);
        });

        dispensationService.create(dispensation).success(function (data) {
            $scope.selectedItems = [];
            $scope.updateDispenseListMessage();
            $scope.initPrescriptions();
        });
    };
}
