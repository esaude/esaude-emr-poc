(function () {
  'use strict';

  angular
    .module('common.patient')
    .component('patientDeleteModal', {
      controller: PatientDeleteModalController,
      controllerAs: 'vm',
      bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
      },
      templateUrl: '../common/patient/directives/patientDeleteModal.html'
    });

  /* @ngInject */
  function PatientDeleteModalController(conceptService, encounterService, notifier, translateFilter) {

    var now = new Date();

    var vm = this;

    vm.data = {
      dead: false,
      causeOfDeath: null,
      deleteReason: '',
      deathDate: now
    };

    vm.deathDatepickerOptions = {maxDate: now};

    vm.$onInit = $onInit;
    vm.ok = ok;
    vm.cancel = cancel;

    function $onInit() {
      getDeathConcepts();
      getPatientEncounters();
    }

    function ok() {
      vm.close({$value: vm.data});
    }

    function cancel() {
      vm.dismiss({$value: 'cancel'});
    }

    function getDeathConcepts() {
      return conceptService.getDeathConcepts()
        .then(function (deathConcepts) {
          vm.deathConcepts = deathConcepts;
        }).catch(function (error) {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }

    function getPatientEncounters() {
      //TODO: refactor getEncountersOfPatient
      return encounterService.getEncountersOfPatient(vm.resolve.patient.uuid)
        .then(function (response) {
          if (response.data.results.length) {
            vm.hasConsultations = true;
            vm.data.dead = true;
          }
        })
        .catch(function (error) {
          notifier.error(translateFilter('COMMON_MESSAGE_ERROR_ACTION'));
        });
    }
  }

})();
