(() => {
  'use strict';

  angular
    .module('common.patient')
    .factory('scheduleService', scheduleService);

  scheduleService.$inject = ['$q', 'cohortService', 'commonService', 'observationsService', 'sessionService', 'visitService'];

  /* @ngInject */
  function scheduleService($q, cohortService, commonService, observationsService, sessionService, visitService) {
    var service = {
      getCurrentProviderSchedule: getCurrentProviderSchedule,
      getPatientSchedule: getPatientSchedule,
      getDrugPickupSchedule: getDrugPickupSchedule
    };
    return service;

    ////////////////

    function getCurrentProviderSchedule() {
      return sessionService.getCurrentProvider()
        .then(currentProvider => {
          var params = {providerUuid: currentProvider.uuid};
          return cohortService.evaluateCohort(Bahmni.Common.Constants.cohortMarkedForConsultationAndCheckedInUuid, params);
        })
        .then(members => $q.all(members.map(m => getLastConsultationAndVisit(m))));
    }

    function getDrugPickupSchedule() {
      return cohortService.evaluateCohort(Bahmni.Common.Constants.markedForPickupDrugsToday)
        .then(members => $q.all(members.map(m => getLastPickup(m))));
    }

    function getPatientSchedule() {
      return cohortService.evaluateCohort(Bahmni.Common.Constants.cohortMarkedForConsultationUuid)
        .then(members => $q.all(members.map(m => getLastConsultationAndVisit(m))));
    }

    function getLastPickup(member) {
      return encounterService
        .getEncountersForPatientByEncounterType(member.uuid, Bahmni.Common.Constants.dispensationEncounterTypeUuid)
        .then(encounters => {
          member.lastEncounter = _.maxBy(encounters, 'encounterDatetime');
        });
    }

    function getLastConsultationAndVisit(member) {
      return observationsService.getObs(member.uuid, Bahmni.Common.Constants.nextConsultationDateUuid)
        .then(obs => {
          var nonRetired = commonService.filterRetired(obs);
          member.scheduledInfo = _.maxBy(nonRetired, 'encounter.encounterDatetime');
        })
        .then(() => visitService.search({
          patient: member.uuid,
          v: 'custom:(visitType,startDatetime,stopDatetime,uuid,encounters)'
        }))
        .then(visits => {
          member.lastVisit = _.maxBy(visits, 'startDatetime');
          return member;
        });
    }
  }

})();

