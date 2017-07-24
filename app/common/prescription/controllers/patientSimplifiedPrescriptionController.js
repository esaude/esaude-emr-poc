(function () {
  'use strict';

  angular
    .module('common.prescription')
    .controller('PatientSimplifiedPrescriptionController', PatientSimplifiedPrescriptionController);

  PatientSimplifiedPrescriptionController.$inject = ['$http', '$filter','$scope', '$rootScope', '$stateParams',
    'observationsService', 'commonService', 'conceptService', 'localStorageService', 'notifier', 'spinner',
    'drugService', 'prescriptionService'];

  /* @ngInject */
  function PatientSimplifiedPrescriptionController($http, $filter, $scope, $rootScope, $stateParams, observationsService,
                                                   commonService, conceptService, localStorageService, notifier, spinner,
                                                   drugService, prescriptionService) {


    var currentProvider = $rootScope.currentProvider;
    var drugMapping = $rootScope.drugMapping;
    var patientUuid;
    var patient = $rootScope.patient;

    var vm = this;
    vm.allRegimes = [];
    vm.arvDrugs = [];
    vm.arvLineEnabled = true;
    vm.existingPrescriptions = [];
    vm.fieldModels = angular.copy(Bahmni.Common.Constants.drugPrescriptionConvSet);
    vm.hasServiceToday = null;//there is no prescription service for the patient today
    vm.isArvPlanInterruptedEdit = false;
    vm.isRegimenChangeEdit = false;
    vm.isRegimenEdit = false;
    vm.listedPrescriptions = [];
    vm.prescriptionItem = {};
    vm.prescriptionDate = new Date();
    vm.regimes = {};
    vm.showMessages = false;
    vm.showNewPrescriptionsControlls = false;
    $scope.cancelationReasonTyped = null;
    $scope.cancelationReasonSelected = null;
    vm.valueToModal = null;

    vm.add = add;
    vm.checkDrugType = checkDrugType;
    vm.doPlanChanged = doPlanChanged;
    vm.doRegimenChanges = doRegimenChanges;
    vm.doTherapeuticLineChanges = doTherapeuticLineChanges;
    vm.edit = edit;
    vm.getDrugs = getDrugs;
    vm.initTherapeuticLine = initTherapeuticLine;
    vm.refill = refill;
    vm.remove = remove;
    vm.removeAll = removeAll;
    vm.reset = reset;
    vm.save = save;
    vm.setPrescritpionItemStatus = setPrescritpionItemStatus;
    vm.cancelOrStop = cancelOrStop;
    vm.setValueToModal = setValueToModal;
    vm.hasActivePrescription = hasActivePrescription;

    activate();

    ////////////////

    function activate() {
      patientUuid = $stateParams.patientUuid;

      function setFieldModels(setMembers) {
        for (var key in vm.fieldModels) {
          var fieldModel = vm.fieldModels[key];
          var members = angular.copy(setMembers);
          fieldModel.model = _.find(members, function (element) {
            return element.uuid === fieldModel.uuid;
          });
        }
      }

      //also get the available regimens here for later
      function loadAllRegimes() {
        //also get the available regimens here for later
        return conceptService.get(Bahmni.Common.Constants.arvRegimensConvSet).then(function (result) {
          vm.allRegimes = result.data;
        });
      }

      var load = conceptService.getPrescriptionConvSetConcept()
        .then(setFieldModels)
        .then(loadSavedPrescriptions(patient))
        .then(loadAllRegimes());

      spinner.forPromise(load);
    }


    function add(valid, form) {
      if (!valid) {
        vm.showMessages = true;
        return;
      }
      //avoid duplication of drugs
      var sameOrderItem = _.find(vm.listedPrescriptions, function (item) {
        return item.drugOrder.drug.uuid === vm.prescriptionItem.drugOrder.drug.uuid;
      });

      if (sameOrderItem) {
        notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ITEM_ALREADY_IN_LIST'));
        return;
      }
      vm.listedPrescriptions.push(vm.prescriptionItem);
      resetForm(form);
      vm.showNewPrescriptionsControlls = true;
      vm.showMessages = false;
    }


    function checkDrugType(drug) {
      if (!_.isObject(drug)) {
        return;
      }
      //check if drug is ARV
      var arvRepr = drugMapping.arvDrugs[drug.uuid];

      if (arvRepr) {
        vm.prescriptionItem.isArv = true;
      } else {
        vm.prescriptionItem.isArv = false;
        vm.prescriptionItem.interruptedReason = {};
        vm.prescriptionItem.isPlanInterrupted = false;
        vm.prescriptionItem.arvPlan = {};
      }
    }


    function doPlanChanged(item) {
      if (vm.prescriptionItem.arvPlan.uuid === Bahmni.Common.Constants.artInterruptedPlanUuid) {
        item.isPlanInterrupted = true;
        vm.isArvPlanInterruptedEdit = true;
      } else {
        item.isPlanInterrupted = false;
        vm.isArvPlanInterruptedEdit = false;
        vm.prescriptionItem.interruptedReason = undefined;
      }
    }


    function doRegimenChanges(regimen) {
      //edit regimen
      vm.prescriptionItem.isRegimenCancelDisabled = false;
      //compare new and old regimen
      if (!_.isUndefined(vm.prescriptionItem.currentRegimen) && vm.prescriptionItem.currentRegimen.uuid !== regimen.uuid) {
        //pervent change regimen if ARV item is selected
        var selectedArvItem = _.find(vm.listedPrescriptions, function (item) {
          return item.isArv === true;
        });
        if (selectedArvItem) {
          notifier.error($filter('translate')('CLINIC_MESSAGE_ERROR_CANNOT_CHANGE_REGIMEN'));
          vm.prescriptionItem.regime = vm.prescriptionItem.currentRegimen;
          vm.prescriptionItem.therapeuticLine = vm.prescriptionItem.currentArvLine;
          return;
        }
        vm.prescriptionItem.isRegimenChanged = true;
        vm.isRegimenChangeEdit = true;
      } else {
        vm.prescriptionItem.isRegimenChanged = false;
        vm.isRegimenChangeEdit = false;
        vm.prescriptionItem.changeReason = undefined;
      }
      getDrugsOfRegimen(regimen);
    }


    function doTherapeuticLineChanges(therapeuticLine) {
      //should never go lower

      //edit regimen
      vm.prescriptionItem.isRegimenCancelDisabled = true;
      vm.regimes = filterRegimes(vm.allRegimes, therapeuticLine);//update the list of regimes
      vm.prescriptionItem.regime = undefined;
    }


    function edit(item) {
      vm.prescriptionItem = item;
      if(item.regime){
         vm.prescriptionItem.isArv  = true;
      }
      _.pull(vm.listedPrescriptions, item);
      isPrescriptionControl();
    }


    function getDrugs(request) {
      if (request.length < 3) return;

      return $http.get(Bahmni.Common.Constants.drugResourceUrl, {
        params: {
          q: request,
          v: "full"

        }
      })
        .then(function (response) {
          return response.data.results.map(function (drug) {
            return drug;
          });
        });
    }


    function initTherapeuticLine() {
      //use regimen of already selected ARV line as the default one
      var selectedArvItem = _.find(vm.listedPrescriptions, function (item) {
        return item.isArv === true;
      });

      if (selectedArvItem) {
        vm.prescriptionItem.therapeuticLine = selectedArvItem.therapeuticLine;
        vm.prescriptionItem.currentArvLine = selectedArvItem.therapeuticLine;
        vm.prescriptionItem.currentRegimen = selectedArvItem.regime;
        vm.prescriptionItem.regime = selectedArvItem.regime;
        return;
      }

      //get the last therapeutic line
      observationsService.get(patientUuid, Bahmni.Common.Constants.drugPrescriptionConvSet.therapeuticLine.uuid)
        .success(function (data) {
          if (_.isEmpty(data.results)) {
            vm.prescriptionItem.therapeuticLine = _.find(vm.fieldModels.therapeuticLine.model.answers,
              function (answer) {
                return answer.uuid === Bahmni.Common.Constants.therapeuticLineQuestion.firstLine;
              });
          } else {
            var nonRetired = commonService.filterRetired(data.results);
            var maxObs = _.maxBy(nonRetired, 'obsDatetime');

            if (maxObs) {
              vm.prescriptionItem.therapeuticLine = swapObsToConceptAnswer(maxObs.value.uuid, vm.fieldModels.therapeuticLine.model.answers);

              if (maxObs.value.uuid === Bahmni.Common.Constants.therapeuticLineQuestion.thirdLine) {
                vm.arvLineEnabled = false;
              }
            }
          }
          vm.prescriptionItem.currentArvLine = angular.copy(vm.prescriptionItem.therapeuticLine);
          // filter the regimes according to age and therapeutic line
          var filteredRegimes = filterRegimes(vm.allRegimes, vm.prescriptionItem.therapeuticLine);
          initRegimes(filteredRegimes);
        });
    }


    function refill(item) {
      item.drugOrder.dosingInstructions = {uuid: item.drugOrder.dosingInstructions};
       if(item.regime){
           item.isArv = true;
        }
        vm.listedPrescriptions.push(angular.copy(item));
        vm.showNewPrescriptionsControlls = true;
     }


    function remove(item) {
      _.pull(vm.listedPrescriptions, item);
      isPrescriptionControl();
    }

    function setValueToModal(item)
    {
      vm.valueToModal = item;
    }

     function removeAll() {
      vm.listedPrescriptions = [];
      isPrescriptionControl();
    }


    function reset(form) {
      resetForm(form);
    }

    function save() {

      var prescription = {

        prescriptionDate: vm.prescriptionDate,
        patient: {uuid: patientUuid},
        provider: {uuid: currentProvider.uuid},
        location: {uuid: localStorageService.cookie.get("emr.location").uuid},
        prescriptionItems: []
      };

      _.forEach(vm.listedPrescriptions, function (element) {

        var prescriptionItem = {

          drugOrder: {
            type: "drugorder",
            careSetting: {uuid: "6f0c9a92-6f24-11e3-af88-005056821db0"},
            dosingInstructions: element.drugOrder.dosingInstructions.uuid,
            dose: element.drugOrder.dose,
            doseUnits: {uuid: element.drugOrder.doseUnits.uuid},
            frequency: {uuid: element.drugOrder.frequency.uuid},
            route: {uuid: element.drugOrder.route.uuid},
            duration: element.drugOrder.duration,
            durationUnits: {uuid: element.drugOrder.durationUnits.uuid},
            quantityUnits: {uuid: element.drugOrder.doseUnits.uuid},
            drug: {uuid: element.drugOrder.drug.uuid}
          },
          regime: element.isArv ? element.regime : null,
          therapeuticLine:  element.isArv ? element.therapeuticLine : null,
          arvPlan:  (element.isArv && element.arvPlan ) ? element.arvPlan: null,
          changeReason: (element.isArv && element.changeReason ) ? element.changeReason : null,
          interruptionReason: (element.isArv && element.interruptedReason ) ? element.interruptedReason : null

        };

        prescription.prescriptionItems.push(prescriptionItem);
      });

      prescriptionService.create(prescription)
        .then(function () {
          notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
          vm.listedPrescriptions = [];
          isPrescriptionControl();
          spinner.forPromise(loadSavedPrescriptions(patient));
        })
        .catch(function () {
          notifier.error($filter('translate')('COMMON_MESSAGE_COULD_NOT_CREATE_PRESCRIPTION'));
        });
    }

    function cancelOrStop(item){

      if((item.drugOrder.action =='NEW' && !$scope.cancelationReasonTyped) || (item.drugOrder.action =='REVISE' && !$scope.cancelationReasonSelected))
      {
         showMessage("COMMON_CANCELATION_PRESCRIPTION_ERROR_NO_REASON");
          return;
      }

        prescriptionService.stopPrescriptionItem(item.drugOrder, (item.drugOrder.action =='NEW') ? $scope.cancelationReasonTyped : $scope.cancelationReasonSelected.uuid)
            .then(function () {
              notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
              vm.listedPrescriptions = [];
              $scope.cancelationReasonSelected = null;
              $scope.cancelationReasonTyped = null;
              isPrescriptionControl();
              spinner.forPromise(loadSavedPrescriptions(patient));
            })
            .catch(function () {
              notifier.error($filter('translate')('COMMON_MESSAGE_COULD_NOT_CANCEL_PRESCRIPTION_ITEM'));
         });

        $(function (){
              $('#cancelPrescriptionModal').modal('toggle');
          });
       }

    function resetForm(form) {
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
      vm.prescriptionItem = {};
    }


    function isPrescriptionControl() {
      if (_.isEmpty(vm.listedPrescriptions)) {
        vm.showNewPrescriptionsControlls = false;
      }
    }


    function genSimpleObs(concept, value, datetime) {
      return {
        concept: concept,
        obsDatetime: datetime,
        person: patientUuid,
        value: value
      }
    }

    function loadSavedPrescriptions(patient) {
      return prescriptionService.getAllPrescriptions(patient).then(function (patientPrescriptions) {
        vm.hasServiceToday = (hasActivePrescription(patientPrescriptions)) ? true : null;
        vm.existingPrescriptions = patientPrescriptions.reverse();
        vm.setPrescritpionItemStatus(vm.existingPrescriptions);
      });
    }

    function hasActivePrescription(prescriptions){

        return _.find(prescriptions, function (prescription) {
            return prescription.prescriptionStatus == true;
        });
    }


    function setPrescritpionItemStatus(prescriptions){
      _.forEach(prescriptions, function (prescription) {
         _.forEach(prescription.prescriptionItems, function (item) {
              if(prescription.prescriptionStatus == true){
                  if((item.drugOrder.action == 'NEW') ||(item.drugOrder.action == 'REVISE') ){
                     item.status = "PHARMACY_ACTIVE";
                  }
                  else{
                     item.status = "PHARMACY_FINALIZED";
                  }
              }
              else{
                item.status = "PHARMACY_FINALIZED";
              }
          });
       });
     }


    function filterRegimes(allRegimes, therapeuticLine) {
      var age = (patient.age.years >= 15) ? "adult" : "child";
      var regimenGroupAge = Bahmni.Common.Constants.regimenGroups[age];
      var regimenGroupTLine = {};
      //find the current therapeutic line
      if (therapeuticLine.uuid === Bahmni.Common.Constants.therapeuticLineQuestion.firstLine) {
        regimenGroupTLine = regimenGroupAge.firstLine;
      }
      else if (therapeuticLine.uuid === Bahmni.Common.Constants.therapeuticLineQuestion.secondLine) {
        regimenGroupTLine = regimenGroupAge.secondLine;
      }
      else if (therapeuticLine.uuid === Bahmni.Common.Constants.therapeuticLineQuestion.thirdLine) {
        regimenGroupTLine = regimenGroupAge.thirdLine;
      }
      return _.find(allRegimes.setMembers, function (member) {
        return member.uuid === regimenGroupTLine;
      });
    }

    function initRegimes(filteredRegimes) {
      vm.regimes = filteredRegimes;
      //get the last regimen
      observationsService.get(patientUuid, Bahmni.Common.Constants.arvConceptUuid)
        .success(function (data) {
          var nonRetired = commonService.filterRetired(data.results);
          var maxObs = _.maxBy(nonRetired, 'obsDatetime');

          if (maxObs) {
            var swappedObsToConcept = swapObsToConceptAnswer(maxObs.value.uuid, filteredRegimes.answers);
            vm.prescriptionItem.regime = swappedObsToConcept;
            vm.prescriptionItem.currentRegimen = swappedObsToConcept;
            //ask for regimen input if doesn't exist
            if (swappedObsToConcept) {
              getDrugsOfRegimen(swappedObsToConcept);
            } else {
              vm.isRegimenEdit = true;
            }
          }
        });
    }

    function getDrugsOfRegimen(regime) {
      drugService.get(regime.uuid)
        .success(function (data) {
          vm.arvDrugs = _.map(data.results, 'drugItem.drug');
        });
    }


    function swapObsToConceptAnswer(obs, conceptAnswers) {
      return _.find(conceptAnswers, function (answer) {
        return obs === answer.uuid;
      });
    }


      var showMessage = function (msg) {
          $scope.errorMessage = msg;
          $(function () {
              $('.alert').show();
          });
      };

  }

})();

