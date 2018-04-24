(function () {
  'use strict';

  angular
    .module('social')
    .factory('sexualPartnersService', sexualPartnersService);

  sexualPartnersService.$inject = ['$q', '$log', 'conceptService', 'encounterService', 'observationsService', 'visitService'];

  /* @ngInject */
  function sexualPartnersService($q, $log, conceptService, encounterService, observationsService, visitService) {

    var SEXUAL_PARTNER_INFORMATION_CONCEPT_UUID = Bahmni.Common.Constants.sexualPartnerInformationConceptUuid;

    var PARTNERS_NAME_CONCEPT_UUID = Bahmni.Common.Constants.partnersNameConceptUuid;

    var RELATIONSHIP_TO_PATIENT_CONCEPT_UUID = Bahmni.Common.Constants.relationshipToPatientConceptUuid;

    var HIV_STATUS_CONCEPT_UUID = Bahmni.Common.Constants.hivStatusConceptUuid;

    var SEXUAL_PARTNER_ENCOUNTER_TYPE_UUID = Bahmni.Common.Constants.sexualPartnerEncounterTypeUuid;

    var service = {
      getFormData: getFormData,
      getSexualPartners: getSexualPartners,
      removeSexualPartner: removeSexualPartner,
      saveSexualPartner: saveSexualPartner
    };
    return service;

    ////////////////

    function getFormData() {
      return $q.all([getRelationshipToPatient(), getHivStatus()])
        .then(function (result) {
          return {
            relationshipToPatient: result[0],
            hivStatus: result[1]
          };
        })
        .catch(function (error) {
          $log.error('XHR Failed for getFormData: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function getSexualPartners(patient) {
      return getPatientSexualPartnerEncounters(patient, 'custom:(uuid,display,obs:(uuid,display,concept,groupMembers:(uuid,display,value,concept:(uuid,display,answers)))')
        .then(function (encounters) {
          var allObs = _.flatMap(encounters, 'obs');
          var partnerObs = _.filter(allObs, {concept: {uuid: SEXUAL_PARTNER_INFORMATION_CONCEPT_UUID}});
          return partnerObs.map(mapSexualPartner);
        })
        .catch(function (error) {
          $log.error('XHR Failed for getSexualPartners: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function removeSexualPartner(sexualPartner) {
      return observationsService.deleteObs(sexualPartner);
    }

    function saveSexualPartner(patient, sexualPartner) {

      return visitService.getTodaysVisit(patient.uuid).then(function (visit) {

          if (!visit) {
            return $q.reject({data: {error: {message: 'patient has not checked-in.'}}});
          }

          var encounter = mapEncounter(visit, patient, sexualPartner);
          var existing = findSexualPartnerEncounter(visit.encounters);
          if (!existing) {
            return createSexualPartnerEncounterWithObs(encounter);
          } else {
            var obs = encounter.obs[0];
            obs.encounter = existing.uuid;
            return observationsService.createObs(obs);
          }
        })
        .then(function (obs) {
          sexualPartner.uuid = obs.uuid;
          return sexualPartner;
        })
        .catch(function (error) {
          $log.error('XHR Failed for saveSexualPartner: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function getPatientSexualPartnerEncounters(patient, representation) {
      return encounterService.getEncountersForPatientByEncounterType(patient.uuid, SEXUAL_PARTNER_ENCOUNTER_TYPE_UUID, representation);
    }

    function findSexualPartnerEncounter(encounters) {
      return encounters.find(function (e) {
        return !e.voided && (e.encounterType.uuid === SEXUAL_PARTNER_ENCOUNTER_TYPE_UUID);
      });
    }

    function createSexualPartnerEncounterWithObs(encounter) {
      encounter.encounterType = {uuid: SEXUAL_PARTNER_ENCOUNTER_TYPE_UUID};
      encounter.patient = {uuid: encounter.patient.uuid};
      return encounterService.create(encounter)
        .then(function (encounter) {
          return encounter.obs[0];
        });
    }

    function mapEncounter(visit, patient, sexualPartner) {
      var now = new Date();
      return {
        visit: visit.uuid,
        patient: patient,
        obs: [
          {
            person: patient.uuid,
            obsDatetime: now,
            concept: SEXUAL_PARTNER_INFORMATION_CONCEPT_UUID,
            groupMembers: [
              {
                concept: PARTNERS_NAME_CONCEPT_UUID,
                person: patient.uuid,
                obsDatetime: now,
                value: sexualPartner.name
              },
              {
                concept: RELATIONSHIP_TO_PATIENT_CONCEPT_UUID,
                person: patient.uuid,
                obsDatetime: now,
                value: sexualPartner.relationship.uuid
              },
              {
                concept: HIV_STATUS_CONCEPT_UUID,
                person: patient.uuid,
                obsDatetime: now,
                value: sexualPartner.hivStatus.uuid
              }
            ]
          }
        ]
      };
    }

    function mapSexualPartner(o) {
      var name = _.find(o.groupMembers, {concept: {uuid: PARTNERS_NAME_CONCEPT_UUID}}).value;
      var hivStatus = _.find(o.groupMembers, {concept: {uuid: HIV_STATUS_CONCEPT_UUID}}).value;
      var relationship = _.find(o.groupMembers, {concept: {uuid: RELATIONSHIP_TO_PATIENT_CONCEPT_UUID}}).value;
      return {
        uuid: o.uuid,
        name: name,
        hivStatus: hivStatus,
        relationship: relationship
      }
    }

    function getRelationshipToPatient() {
      return conceptService.getConcept(RELATIONSHIP_TO_PATIENT_CONCEPT_UUID);
    }

    function getHivStatus() {
      return conceptService.getConcept(HIV_STATUS_CONCEPT_UUID);
    }
  }

})();
