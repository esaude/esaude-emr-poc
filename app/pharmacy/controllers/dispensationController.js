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

        var arvConcepUuid = "e1d83d4a-1d5f-11e0-b929-000c29ad1d07";

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
            item.disable = true;
            if (arvConcepUuid === item.conceptParentUuid) {
                item.showNextPickupDate = true;
                item.quantity = 1;
                item.nextPickupDate = new Date();
            }

            $scope.selectedItems.push(item);
            $scope.updateDispenseListMessage();
        };

        //fake just for now
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

        $scope.remove = function (item) {
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

    $scope.updatePickUp = function (item) {

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

    $scope.dispense = function() {

        var dispensation = {

            providerUuid : $rootScope.currentUser.person.uuid,

            patientUuid : $rootScope.patient.uuid,

            locationUuid : localStorageService.cookie.get("emr.location").uuid,

            dispensationItems : []
        };

        _.forEach($scope.selectedItems, function (item) {

            var dispensationItem = {
                orderUuid : item.order.uuid,
                quantityToDispense : item.quantity ? item.quantity : item.order.quantity,
                quantityDispensed : item.drugPickedUp,
                dateOfNextPickUp : item.nextPickupDate,
                conceptParentUuid : item.conceptParentUuid
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
