    'use strict';

    angular.module('pharmacy')
            .controller('DispensationController', DispensationController);

    DispensationController.$inject = ["$scope", "$rootScope", "$stateParams",
                            "encounterService", "observationsService", "commonService", "dispensationService", "prescriptionService", "localStorageService"];

    function DispensationController($scope, $rootScope, $stateParams, encounterService,
                        observationsService, commonService, dispensationService, prescriptionService, localStorageService) {
        //TODO: Check if vm is needed 
        var dateUtil = Bahmni.Common.Util.DateUtil;
        
        (function () {
            $scope.selectedItems = [];

            $scope.today = dateUtil.getDateWithoutTime(dateUtil.now());

            var arvConcepUuid = "e1d83d4a-1d5f-11e0-b929-000c29ad1d07";

            $scope.prescriptiontNoResultsMessage = "PHARMACY_LIST_NO_ITEMS";

            $scope.initPrescriptions = function () {

                var patientUuid = $rootScope.patient.uuid;

                prescriptionService.getPatientPrescriptions(patientUuid).success(function (data) {
                    $scope.prescriptions = data.results;
                    $scope.prescription = data.results[0];
                    $scope.prescriptiontNoResultsMessage = _.isEmpty($scope.prescriptions) ? "PHARMACY_LIST_NO_ITEMS" : null;
                });                   
            };

            $scope.calculateItemValidity = function (durationUnit, prescriptionDate) {
                var durationDays = _.find(Poc.Pharmacy.Constants.daysOfDurationUnits, function (e) {
                    return e.uuid === durationUnit.uuid;
                });

                return dateUtil.addDays(dateUtil.getDateWithoutTime(prescriptionDate), durationDays.days);
            };

            $scope.calculateToPickupQty = function (durationUnit, dosage) {
                return calculateItemQuantity(durationUnit, dosage);
            };

            $scope.select = function (item) {
                item.disable = true;
                if (arvConcepUuid === item.conceptParentUuid) {
                    item.showNextPickupDate = true;
                }

                $scope.selectedItems.push(item);
                $scope.updateDispenseListMessage();
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

            item.nextPickupDate = dateUtil.addDays(dateUtil.getDateWithoutTime(item.prescriptionDate), item.quantity);
        };

        $scope.dispense = function() {

            console.log($rootScope);

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