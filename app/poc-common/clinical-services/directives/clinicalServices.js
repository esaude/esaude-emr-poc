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
        add: '&onAdd',
        edit: '&onEdit',
        patientUuid: '=',
        serviceForms: '=',
        services: '=',
        hasVisitToday: '=',
        todayVisit: '='
      }
    };
    return directive;
  }

  ClinicalServiceDirectiveController.$inject = ['encounterService', 'patientService', 'authorizationService'];

  function ClinicalServiceDirectiveController(encounterService, patientService, authorizationService) {

    var dateUtil = Bahmni.Common.Util.DateUtil;

    var vm = this;

    vm.patient = {};
    vm.$onInit = onInit;
    vm.checkRestrictionsToAdd = checkRestrictionsToAdd;
    vm.getPrivilege = getPrivilege;
    vm.removeEncounter = removeEncounter;
    vm.toggleListEncounters = toggleListEncounters;

    ////////////////

    function onInit() {
      patientService.getPatient(vm.patientUuid).then(function (patient) {

        vm.patient = patient;

        authorizationService.authorizeClinicalServices(vm.services).then(function (authServices) {
          vm.services = authServices;
          vm.services.forEach(function (s) {
            initService(s, patient);
          });
        });
      });
    }


    function initService(service, patient) {
      var formPayload = vm.serviceForms[service.id];

      var getEncounters = encounterService.getEncountersForEncounterType(patient.uuid, formPayload.encounterType.uuid);

      // TODO: use 'getEncounters.then' after getEncountersForEncounterType is properly refactored to handle xhr failures
      getEncounters.success(function (data) {
          var nonVoidedEncounters = encounterService.filterRetiredEncoounters(data.results);
          var sortedEncounters = _.sortBy(nonVoidedEncounters, function (encounter) {
            return moment(encounter.encounterDatetime).toDate();
          }).reverse();

          if (service.markedOn) {
            service.encountersForService = _.filter(sortedEncounters, function (e) {
              var foundObs = _.find(e.obs, function (o) {
                return o.concept.uuid === service.markedOn;
              });
              return angular.isDefined(foundObs);
            });
          } else {
            service.encountersForService = sortedEncounters;
          }
          service.lastEncounterForService = sortedEncounters[0];
          service.lastEncounterForServiceMarked = service.encountersForService[0];

          if (service.lastEncounterForServiceMarked) {
            if (service.markedOn) {
              service.lastEncounterForServiceDate = _.find(service.lastEncounterForServiceMarked.obs, function (o) {
                return o.concept.uuid === service.markedOn;
              }).value;
            } else {
              service.lastEncounterForServiceDate = service.lastEncounterForServiceMarked.encounterDatetime;
            }
          }

          service.hasEntryToday = false;

          if (vm.todayVisit && service.lastEncounterForService) {
            service.hasEntryToday = (dateUtil.diffInDaysRegardlessOfTime(vm.todayVisit.startDatetime,
              service.lastEncounterForService.encounterDatetime) === 0);
          }
          service.list = false;
        });

      checkContraints(service);
    }


    function checkContraints(service) {
      service.showService = true;

      if (service.constraints.requireChekin) {
        service.showService =  vm.hasVisitToday;
      }

      if (service.constraints.minAge &&
        vm.patient.age.years < service.constraints.minAge) {
        service.showService = false;
      }

      if (service.constraints.maxAge &&
        vm.patient.age.years > service.constraints.maxAge) {
        service.showService = false;
      }
    }


    function checkRestrictionsToAdd(service) {
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

