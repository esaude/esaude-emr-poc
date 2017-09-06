(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices')
    .directive('clinicalServices', clinicalService);


  function clinicalService() {
    var directive = {
      bindToController: true,
      controller: ClinicalServiceDirectiveController,
      controllerAs: 'vm',
      restrict: 'AE',
      templateUrl: ' ../poc-common/clinical-services/views/clinicalServices.html',
      scope: {
        patientUuid: '='
      }
    };
    return directive;
  }

  ClinicalServiceDirectiveController.$inject = ['$filter', '$q', '$state', 'patientService', 'visitService',
    'clinicalServiceForms', 'notifier'];

  function ClinicalServiceDirectiveController($filter, $q, $state, patientService, visitService, clinicalServiceForms,
                                              notifier) {

    var vm = this;

    vm.services = [];

    vm.$onInit = onInit;
    vm.canAdd = canAdd;
    vm.getPrivilege = getPrivilege;
    vm.linkServiceAdd = linkServiceAdd;
    vm.linkServiceDisplay = linkServiceDisplay;
    vm.linkServiceEdit = linkServiceEdit;
    vm.removeEncounter = removeEncounter;
    vm.toggleListEncounters = toggleListEncounters;

    ////////////////

    function onInit() {
      $q.all([
        visitService.getTodaysVisit(vm.patientUuid),
        patientService.getPatient(vm.patientUuid)
      ])
        .then(function (result) {
          var todaysVisit = result[0];
          var patient = result[1];
          initServices(patient, todaysVisit);
        });
    }


    function initServices(patient, todayVisit) {

      clinicalServiceForms
        .getClinicalServiceWithEncountersForPatient(patient)
        .then(function (clinicalServices) {
          vm.services = clinicalServices;
          vm.services.forEach(function (s) {
            checkConstraints(s, patient, todayVisit);
          });
        })
        .catch(function () {
          notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function linkServiceAdd(service) {
      var formLayout = clinicalServiceForms.getFormLayouts(service);
      $state.go(formLayout.sufix + formLayout.parts[0].sref, {
        patientUuid: vm.patientUuid,
        serviceId: service.id,
        encounter: service.hasEntryToday ? service.lastEncounterForService : null
      });
    }

    function linkServiceEdit(service, encounter) {
      var formLayout = clinicalServiceForms.getFormLayouts(service);
      $state.go(formLayout.sufix + formLayout.parts[0].sref, {
        patientUuid: vm.patientUuid,
        serviceId: service.id,
        encounter: encounter
      });
    }

    function linkServiceDisplay(service, encounter) {
      var formLayout = clinicalServiceForms.getFormLayouts(service);
      $state.go(formLayout.sufix + '_display', {
        patientUuid: vm.patientUuid,
        serviceId: service.id,
        encounter: encounter
      });
    }

    function checkConstraints(service, patient, todayVisit) {
      service.showService = true;

      if (service.constraints.requireChekin) {
        service.showService = todayVisit !== null;
      }

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


    function removeEncounter(encounter) {
      (angular.isUndefined(encounter.delete) || encounter.delete === false) ?
        encounter.delete = true : encounter.delete = false;
    }


    function getPrivilege(prefix, service) {
      return prefix + ' ' + service.privilege;
    }

  }

})();

