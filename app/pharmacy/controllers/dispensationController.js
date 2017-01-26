    'use strict';

    angular.module('pharmacy')
            .controller('DispensationController', DispensationController);

    DispensationController.$inject = ["$scope", "$rootScope", "$stateParams",
                            "encounterService", "observationsService", "commonService"];

    function DispensationController($scope, $rootScope, $stateParams, encounterService,
                        observationsService, commonService) {
        //TODO: Check if vm is needed 
        var vm = this;
        var dateUtil = Bahmni.Common.Util.DateUtil;
        
        (function () {
            $scope.selectedItems = [];

            $scope.today = dateUtil.getDateWithoutTime(dateUtil.now());

            $scope.initPrescriptions = function () {
                var concepts = [Bahmni.Common.Constants.prescriptionConvSetConcept];

                var patient = $rootScope.patient;
                var adultFollowupEncounterUuid = Bahmni.Common.Constants.adultFollowupEncounterUuid;
                var childFollowupEncounterUuid = Bahmni.Common.Constants.childFollowupEncounterUuid;

                encounterService.getEncountersForEncounterType(patient.uuid,
                (patient.age.years >= 15) ? adultFollowupEncounterUuid : childFollowupEncounterUuid)
                        .success(function (data) {
                            var filteredResults = commonService.filterGroupReverseFollowupObs(concepts, data.results);

                                if (_.isEmpty(filteredResults)) return;

                                var filteredResult = _.head(filteredResults);

                                $scope.prescription = {};

                                var existingModels = {
                                    prescriptionDate: filteredResult.encounterDatetime,
                                    models: []
                                };

                                _.forEach(filteredResult.obs, function (pSet) {
                                    var existingModel = angular.copy(Bahmni.Common.Constants.drugPrescriptionConvSet);
                                    for (var key in existingModel) {
                                        var m = existingModel[key];
                                        var foundModel = _.find(pSet.groupMembers, function (element) {
                                            return element.concept.uuid === m.uuid;
                                        });
                                        if (_.isUndefined(foundModel)) continue;

                                        if (key === "otherDrugs") {
                                            if (_.includes(Bahmni.Common.Constants.prophilaxyDrugConcepts, foundModel.value.uuid)) {
                                                continue;
                                            }
                                        }
                                        if (key === "prophilaxyDrugs") {
                                            if (!_.includes(Bahmni.Common.Constants.prophilaxyDrugConcepts, foundModel.value.uuid)) {
                                                continue;
                                            }
                                        }

                                        m.model = foundModel.concept;
                                        m.value = foundModel.value;
                                    }
                                    existingModels.models.push(existingModel);
                                });
                                $scope.prescription = existingModels;
                            });
            };

            $scope.calculateItemValidity = function (durationUnit, prescriptionDate) {
                var durationDays = _.find(Poc.Pharmacy.Constants.daysOfDurationUnits, function (e) {
                    return e.uuid === durationUnit.value.uuid;
                });
                
                return dateUtil.addDays(dateUtil.getDateWithoutTime(prescriptionDate), durationDays.days);
            };

            $scope.calculateToPickupQty = function (durationUnit, dosage) {
                return calculateItemQuantity(durationUnit, dosage);
            };

            $scope.select = function (item) {
                item.disable = true;
                $scope.selectedItems.push(item);
                updateDispenseListMessage();
            };

            $scope.remove = function (item) {
                item.disable = false;
                _.pull($scope.selectedItems, item);
                updateDispenseListMessage();
            };

            var calculateItemQuantity = function (durationUnit, dosage) {
                var durationDays = _.find(Poc.Pharmacy.Constants.daysOfDurationUnits, function (e) {
                    return e.uuid === durationUnit.value.uuid;
                });
                
                return durationDays.days * dosage;
            };

            var updateDispenseListMessage = function () {
                $scope.dispenseListNoResultsMessage = $scope.selectedItems.length === 0 ? "PHARMACY_LIST_NO_ITEMS" : null;
            };

            updateDispenseListMessage();
                
        })();
    }