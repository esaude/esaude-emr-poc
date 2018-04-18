(function () {
  'use strict';

  angular.module('pharmacy').controller('DispensationHistoryController', DispensationHistoryController);

  DispensationHistoryController.$inject = ["$filter", "$stateParams", "encounterService", "dispensationService", "commonService", "notifier"];

  function DispensationHistoryController($filter, $stateParams, encounterService, dispensationService, commonService,  notifier) {

    var patientUuid = null;
    var pharmacyEncounterTypeUuid = null;

    var vm = this;
    vm.cancelationReasonTyped = null;
    vm.dispensationItemToCancel = null;
    vm.filaObsList = null;
    vm.pickups =[];
    vm.dispensationItemToCancel = null;
    vm.errorMessage = null;

    vm.initPickUpHistory = initPickUpHistory;
    vm.prepareObservations = prepareObservations;
    vm.filterActiveOrders = filterActiveOrders;
    vm.cancelDispensationItem = cancelDispensationItem;
    vm.valueOfField = valueOfField;
    vm.setDispensationItemToCancel = setDispensationItemToCancel;
    vm.closeCancellationModal = closeCancellationModal;

    activate();

    function activate() {

      vm.filaObsList = {
        nextPickup: "e1e2efd8-1d5f-11e0-b929-000c29ad1d07",
        quantity: "e1de2ca0-1d5f-11e0-b929-000c29ad1d07"
      };

      patientUuid = $stateParams.patientUuid;
      pharmacyEncounterTypeUuid = "18fd49b7-6c2b-4604-88db-b3eb5b3a6d5f";

      initPickUpHistory();
     //initPickUpHistory();
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

      encounterService.getEncountersForEncounterType(patientUuid, pharmacyEncounterTypeUuid).success(function (data) {
        vm.pickups = prepareObservations(commonService.filterReverse(data));
      });
    }

    function cancelDispensationItem(form, dispensationItemToCancel){

      if (!form.$valid) {
        return;
      }

      dispensationService.cancelDispensationItem(dispensationItemToCancel.uuid, vm.cancelationReasonTyped )
        .then(function () {
          notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
          closeCancellationModal(form);
          initPickUpHistory();
        })
        .catch(function () {
          notifier.error($filter('translate')('COMMON_MESSAGE_COULD_NOT_CANCEL_DISPENSATION_ITEM'));
        });
    }

    function valueOfField(conceptUuid, members) {

      return _.find(members, function (member) {
        return member.concept.uuid === conceptUuid;
      });
    }

    function closeCancellationModal(form) {
      // TODO: handle close via esc key
      form.$setPristine();
      form.$setUntouched();
      vm.cancelationReasonTyped = null;
      vm.dispensationItemToCancel = null;
      getCancellationModal().modal('hide');
    }

    function setDispensationItemToCancel(order){
      vm.dispensationItemToCancel =  order;
    }

    function getCancellationModal() {
      return angular.element('#cancellationDispensationItemModal');
    }

  }
})();
