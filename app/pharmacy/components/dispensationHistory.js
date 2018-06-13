(function () {
  'use strict';

  angular
    .module('pharmacy')
    .component('dispensationHistory', {
      bindings: {
        patient: '<'
      },
      controller: DispensationHistoryController,
      controllerAs: 'vm',
      templateUrl: '../pharmacy/components/dispensationHistory.html'
    });

  /* @ngInject */
  function DispensationHistoryController($filter, $uibModal, encounterService, dispensationService, commonService, notifier) {

    var pharmacyEncounterTypeUuid = null;

    var vm = this;
    vm.cancelationReasonTyped = null;
    vm.dispensationItemToCancel = null;
    vm.filaObsList = null;
    vm.pickups =[];
    vm.dispensationItemToCancel = null;
    vm.errorMessage = null;

    vm.$onInit = $onInit;
    vm.valueOfField = valueOfField;
    vm.cancelDispensationItem = cancelDispensationItem;

    function $onInit() {

      vm.filaObsList = {
        nextPickup: "e1e2efd8-1d5f-11e0-b929-000c29ad1d07",
        quantity: "e1de2ca0-1d5f-11e0-b929-000c29ad1d07"
      };

      pharmacyEncounterTypeUuid = "18fd49b7-6c2b-4604-88db-b3eb5b3a6d5f";

      initPickUpHistory();
    }

    function prepareObservations (encounters) {

      var observations = [];

      _.forEach(encounters, function (encounter) {

        _.forEach(encounter.obs, function (observation) {

          if(observation.groupMembers){
            var filteredGroupMembers = filterActiveOrders(observation.groupMembers) ;
            if(!_.isEmpty(filteredGroupMembers)){
              var obs = {
                encounterDatetime : encounter.encounterDatetime,
                provider : encounter.provider.display,
                members : filteredGroupMembers,
                encounterPrecription : encounter
              };
              observations.push(obs);
            }
          }
        });
      });
      return observations;
    }

    function filterActiveOrders(groupMembers) {

      var activeMembers = [];
      _.forEach(groupMembers, function (member) {
        if(member.order.voided === false){
          activeMembers.push(member);
        }
      });
      return activeMembers;
    }

    function initPickUpHistory(){

      encounterService.getEncountersForEncounterType(vm.patient.uuid, pharmacyEncounterTypeUuid).then(function (encounters) {
        vm.pickups = prepareObservations(commonService.filterReverse(encounters));
      });
    }

    function valueOfField(conceptUuid, members) {

      return _.find(members, function (member) {
        return member.concept.uuid === conceptUuid;
      });
    }

    function cancelDispensationItem(order){
      var cancelDispensationItemModal = $uibModal.open({
        component: 'cancelDispensationItemModal',
        resolve: {
          dispensationItem: function () {
            return order;
          }
        }
      });

      cancelDispensationItemModal.result
        .then(function (reason) {
          // Don't chain so that reject is not mistaken with modal cancel
          dispensationService.cancelDispensationItem(order.uuid, reason)
            .then(function () {
              notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
              initPickUpHistory();
            })
            .catch(function (error) {
              notifier.error(error.data.error.message.replace('[','').replace(']',''));
            });
        });
        // Do nothing if modal cancelled

    }

  }

})();
