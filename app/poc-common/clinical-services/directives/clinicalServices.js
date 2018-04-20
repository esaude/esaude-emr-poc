(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices')
    .component('clinicalServices', {
      controller: ClinicalServiceDirectiveController,
      controllerAs: 'vm',
      templateUrl: '../poc-common/clinical-services/directives/clinicalServices.html'
    });

  ClinicalServiceDirectiveController.$inject = ['$filter', '$q', '$state', 'clinicalServicesService', 'notifier',
    'patientService',  'visitService'];

  function ClinicalServiceDirectiveController($filter, $q, $state, clinicalServicesService, notifier, patientService,
                                               visitService) {

    var services = null;

    var currentPatient = {};

    var vm = this;

    var patientCheckedIn = false;

    vm.$onInit = onInit;
    vm.canAdd = canAdd;
    vm.checkActionConstraints = checkActionConstraints;
    vm.getPrivilege = getPrivilege;
    vm.getServices = getServices;
    vm.linkServiceAdd = linkServiceAdd;
    vm.linkServiceDisplay = linkServiceDisplay;
    vm.linkServiceEdit = linkServiceEdit;
    vm.toggleDelete = toggleDelete;
    vm.toggleListEncounters = toggleListEncounters;
    vm.deleteClinicalService = deleteClinicalService;

    ////////////////

    function onInit() {
      currentPatient = clinicalServicesService.getCurrentPatient();


        visitService.getTodaysVisit(currentPatient.uuid)
          .then(function (todaysVisit) {
            patientCheckedIn = todaysVisit !== null;
            return initServices(currentPatient);
          });
    }


    function initServices(patient) {

      return clinicalServicesService
        .getClinicalServiceWithEncountersForPatient(patient)
        .then(function (clinicalServices) {
          services = clinicalServices;
        })
        .catch(function () {
          notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function linkServiceAdd(service) {
      var formLayout = clinicalServicesService.getFormLayouts(service);
      $state.go(formLayout.sufix + formLayout.parts[0].sref, {
        patientUuid: currentPatient.uuid,
        serviceId: service.id,
        encounter: (service.hasServiceToday) ? service.lastServiceToday : null,
        returnState: $state.current
      });
    }

    function linkServiceEdit(service, encounter) {
      var formLayout = clinicalServicesService.getFormLayouts(service);
      $state.go(formLayout.sufix + formLayout.parts[0].sref, {
        patientUuid: currentPatient.uuid,
        serviceId: service.id,
        encounter: encounter,
        returnState: $state.current
      });
    }

    function linkServiceDisplay(service, encounter) {
      var formLayout = clinicalServicesService.getFormLayouts(service);
      $state.go(formLayout.sufix + '_display', {
        patientUuid: currentPatient.uuid,
        serviceId: service.id,
        encounter: encounter,
        returnState: $state.current
      });
    }

    function canAdd(service) {
      var canAdd;
      if (service.maxOccur < 0 || service.encountersForService.length < service.maxOccur) {
        canAdd = true;
        if (service.hasEntryToday) {
          if (service.markedOn) {
            var foundMark = _.find(service.lastEncounterForService.obs, function (o) {
              return o.concept.uuid === service.markedOn;
            });
            if (foundMark) canAdd = false;
          } else {
            canAdd = false;
          }
        }
      }
      return canAdd;
    }


    function toggleListEncounters(service) {
      service.list = !service.list;
    }


    function toggleDelete(encounter) {
      encounter.delete = !encounter.delete;
    }

    function deleteClinicalService(service, encounterUuid) {
      clinicalServicesService.deleteService(service.id, encounterUuid).then(function () {

        _.remove(service.encountersForService, {
            uuid: encounterUuid
        });

        notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
        if (_.isEmpty(service.encountersForService)) {
          $state.reload();
        }
      }).catch(function() {
        notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
      });
    }


    function getPrivilege(prefix, service) {
      return prefix + ' ' + service.privilege;
    }

    function getServices() {
      return services;
    }

    function checkActionConstraints(service) {
      if (service.actionConstraints && service.actionConstraints.requireCheckIn) {
        return patientCheckedIn;
      }
      return true;
    }

  }

})();

