'use strict';

angular.module('clinic')
        .controller('PatientPrescriptionController', ["$scope", "$rootScope", "$stateParams", 
                        "encounterService", "observationsService", "commonService", "conceptService",
                    function ($scope, $rootScope, $stateParams, encounterService, 
                    observationsService, commonService, conceptService) {
        var patientUuid;
        var dateUtil = Bahmni.Common.Util.DateUtil;

        (function () {
            patientUuid = $stateParams.patientUuid;
            $scope.listedPrescriptions = [];
            $scope.existingPrescriptions = [];
            
            conceptService.get('e1d83e4e-1d5f-11e0-b929-000c29ad1d07').success(function (data) {
                $scope.regimen = data;
            });
            
            $scope.units = [
                {name: "Capsula(s)"},
                {name: "Comprimido(s)"},
                {name: "ml"},
                {name: "mg"},
                {name: "Gota(s)"},
                {name: "Colher de chá"},
                {name: "Colher de sopa"}
                
            ];
            
            $scope.frequencies = [
                {name: "Imediatamente"},
                {name: "Uma vez por dia"},
                {name: "Duas vezes por dia"},
                {name: "Três vezes por dia"},
                {name: "Quatro vezes por dia"},
                {name: "A cada hora"},
                {name: "De 2 em 2 horas"},
                {name: "De 4 em 4 horas"},
                {name: "De 8 em 8 horas"},
                {name: "Em cada 12 horas"}
            ];
            
            $scope.routes = [
                {name: "Intramuscular"},
                {name: "Nasal"},
                {name: "Topical"},
                {name: "Intra-óssea"},
                {name: "Intratecal"},
                {name: "Intraperitoneal"},
                {name: "Sublingual"},
                {name: "Per reto"},
                {name: "Per vaginal"},
                {name: "Oral"}
            ];
            
            $scope.durationUnits = [
                {name: "Dia(s)"},
                {name: "Mês(es)"},
                {name: "Ano(s)"}
            ];
            
            $scope.instructions = [
                {name: "Antes das refeições"},
                {name: "Depois das refeições"},
                {name: "Estómago vazio"},
                {name: "De manhã"},
                {name: "De tarde"},
                {name: "Ao deitar"}
            ];
        })();
        
        $scope.addToList = function () {
            $scope.listedPrescriptions.push($scope.prescription);
            $scope.prescription = undefined;
            $scope.showNewPrescriptionsControlls = true;
        };
        
        $scope.save = function () {
            var prescription = {};
            prescription.prescriptionDate = dateUtil.now();
            prescription.values = [];
            
            _.forEach($scope.listedPrescriptions, function (data) {
                var value = {
                    name: data.drug.name,
                    unit: data.drug.unit,
                    frequency: data.drug.frequency,
                    route: data.drug.route,
                    duration: data.drug.duration,
                    durationUnit: data.drug.durationUnit,
                    instruction: data.drug.instruction,
                    
                };
                prescription.values.push(value);
            });
            $scope.existingPrescriptions.push(prescription);
        };
        
        $scope.initPrescriptions = function () {
            //existing
            var prescription1 = {
                prescriptionDate: '2016-09-01',
                values: [
                    {
                        name: {display: "LAMIVUDINE"},
                        dose: 1,
                        unit: $scope.units[0],
                        frequency: $scope.frequencies[0],
                        route: $scope.routes[0],
                        duration: 1,
                        durationUnit: $scope.durationUnits[0],
                        instruction: $scope.instructions[1]
                    },
                    {
                        name: {display: "PARACETAMOL"},
                        dose: 1,
                        unit: $scope.units[1],
                        frequency: $scope.frequencies[0],
                        route: $scope.routes[0],
                        duration: 1,
                        durationUnit: $scope.durationUnits[1],
                        instruction: $scope.instructions[1]
                    }
                ]
            };
            
            $scope.existingPrescriptions.push(prescription1);
        };
    }]);
