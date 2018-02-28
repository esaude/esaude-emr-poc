(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices')
    .directive('clinicalServices', clinicalService)
    .controller('ClinicalServiceDirectiveController', ClinicalServiceDirectiveController);


  function clinicalService() {
    var directive = {
      bindToController: true,
      controller: ClinicalServiceDirectiveController,
      controllerAs: 'vm',
      restrict: 'AE',
      templateUrl: ' ../poc-common/clinical-services/directives/clinicalServices.html',
      scope: {
        patientUuid: '='
      }
    };
    return directive;
  }

  ClinicalServiceDirectiveController.$inject = ['$filter', '$q', '$state', 'clinicalServicesService', 'notifier',
    'patientService', 'spinner', 'visitService'];

  function ClinicalServiceDirectiveController($filter, $q, $state, clinicalServicesService, notifier, patientService,
                                              spinner, visitService) {

    var services = null;

    var vm = this;

    var patientCheckedIn = false;

    vm.$onInit = onInit;
    vm.canAdd = canAdd;
    vm.checkActionConstraints = checkActionConstraints;
    vm.getPrivilege = getPrivilege;
    vm.getVisibleServices = getVisibleServices;
    vm.linkServiceAdd = linkServiceAdd;
    vm.linkServiceDisplay = linkServiceDisplay;
    vm.linkServiceEdit = linkServiceEdit;
    vm.toggleDelete = toggleDelete;
    vm.toggleListEncounters = toggleListEncounters;
    vm.deleteClinicalService = deleteClinicalService;

    ////////////////

    function onInit() {
      var load = $q.all([
        visitService.getTodaysVisit(vm.patientUuid),
        patientService.getPatient(vm.patientUuid)
      ])
        .then(function (result) {
          patientCheckedIn = result[0] !== null;
          var patient = result[1];
          return initServices(patient);
        });

      spinner.forPromise(load);
    }


    function initServices(patient) {

      return clinicalServicesService
        .getClinicalServiceWithEncountersForPatient(patient)
        .then(function (clinicalServices) {
          services = clinicalServices;
          services.forEach(function (s) {
            checkConstraints(s, patient);
          });
        })
        .catch(function () {
          notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function linkServiceAdd(service) {
      var formLayout = clinicalServicesService.getFormLayouts(service);
      $state.go(formLayout.sufix + formLayout.parts[0].sref, {
        patientUuid: vm.patientUuid,
        serviceId: service.id,
        encounter: (service.hasServiceToday) ? service.lastServiceToday : null,
        returnState: $state.current
      });
    }

    function linkServiceEdit(service, encounter) {
      var formLayout = clinicalServicesService.getFormLayouts(service);
      $state.go(formLayout.sufix + formLayout.parts[0].sref, {
        patientUuid: vm.patientUuid,
        serviceId: service.id,
        encounter: encounter,
        returnState: $state.current
      });
    }

    function linkServiceDisplay(service, encounter) {
      var formLayout = clinicalServicesService.getFormLayouts(service);
      $state.go(formLayout.sufix + '_display', {
        patientUuid: vm.patientUuid,
        serviceId: service.id,
        encounter: encounter,
        returnState: $state.current
      });
    }

    function checkConstraints(service, patient) {
      service.showService = true;

      if (service.constraints.minAge &&
        patient.age.years < service.constraints.minAge) {
        service.showService = false;
      }

      if (service.constraints.maxAge &&
        patient.age.years > service.constraints.maxAge) {
        service.showService = false;
      }
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

    function getVisibleServices() {
      if (services) {
        return services.filter(function (s) {
          return s.showService;
        });
      }
      return null;
    }

    function checkActionConstraints(service) {
      if (service.actionConstraints && service.actionConstraints.requireCheckIn) {
        return patientCheckedIn;
      }
      return true;
    }

  }

})();

