(function () {
  'use strict';

  angular.module('clinic')
    .component('patientNotes', {
      bindings: {
        patient: '<'
      },
      controller: PatientNotesController,
      controllerAs: 'vm',
      templateUrl: '../clinic/components/patientNotes.html'
    });

  /* @ngInject */
  function PatientNotesController(encounterService) {

    var vm = this;

    vm.$onInit = $onInit;

    vm.showNotes = true;

    function $onInit() {
      encounterService.getEncountersForEncounterType(vm.patient.uuid, Bahmni.Common.Constants.pocCurrentStoryEncounterUuid, "default")
        .then(encounters => {
          var nonRetired = encounterService.filterRetiredEncoounters(encounters);

          if (_.isEmpty(nonRetired)) {
            vm.showNotes = false;
            return;
          }
          vm.allNotes = nonRetired;
          vm.lastNotes = _.maxBy(nonRetired, 'encounterDatetime');
          vm.lastNotesMessageType = _.find(vm.lastNotes.obs, o => o.concept.uuid === Bahmni.Common.Constants.typeOfMessageConceptUuid);
          vm.lastNotesStory = _.find(vm.lastNotes.obs, o => o.concept.uuid === Bahmni.Common.Constants.observationStoryConceptuuid);
          vm.messageTypeMapping = Bahmni.Common.Constants
            .messageTypeRepresentation[vm.lastNotesMessageType.value.uuid];
        });
    }
  }

})();
