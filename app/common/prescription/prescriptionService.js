(() => {
  'use strict';

  angular
    .module('poc.common.prescription')
    .factory('prescriptionService', prescriptionService);

  function prescriptionService($http, $q, $log, conceptService, observationsService, prescriptionConvSetConceptUUID,
                               drugPrescriptionConvSet, therapeuticLineQuestion, arvRegimensConvSet, regimenGroups,
                               arvConceptUuid, artInterruptedPlanUuid) {

    const sortByEncounterDateTime = _.curryRight(_.sortBy, 2)(encounter => encounter.encounterDatetime);

    return {
      create: create,
      stopPrescriptionItem: stopPrescriptionItem,
      getAllPrescriptions: getAllPrescriptions,
      getPatientNonDispensedPrescriptions: getPatientNonDispensedPrescriptions,
      getPatientRegimen: getPatientRegimen,
      getPrescriptionConvSetConcept: getPrescriptionConvSetConcept,
      getRegimensByTherapeuticLine: getRegimensByTherapeuticLine,
      isArtPlanInterrupt: isArtPlanInterrupt,
    };

    ////////////////
    /**
     * @returns {Promise<Object>} Array of concepts mapped by key defined in drugPrescriptionConvSet constant.
     */
    function getPrescriptionConvSetConcept() {
      const representation = 'custom:(uuid,display,setMembers:(uuid,display,answers:(uuid,display)))';
      return conceptService.getConcept(prescriptionConvSetConceptUUID, representation)
        .then(concept => {
          return Object.keys(drugPrescriptionConvSet).reduce((acc, cur) => {
            acc[cur] = concept.setMembers.find(m => m.uuid === drugPrescriptionConvSet[cur].uuid);
            return acc;
          }, {});
        })
        .catch(error => {
          $log.error('XHR Failed for getPrescriptionConvSetConcept: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    /**
     * Returns prescriptions not fully dispensed for patient.
     *
     * @param {String} patientUuid
     * @returns {Promise}
     */
    function getPatientNonDispensedPrescriptions(patientUuid) {
      return $http.get(Bahmni.Common.Constants.prescriptionUrl, {

        params: {
          patient: patientUuid,
          findAllActive: true,
          v: "full"
        },

        withCredentials: true
      }).then(response => {
        const mapPrescription = _.curryRight(_.map)(prescriptionMapper);
        return _.flow([mapPrescription, sortByEncounterDateTime])(response.data.results);
      }).catch(error => {
        $log.error('XHR Failed for getPatientNonDispensedPrescriptions: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

    function getFirstTherapeuticLineRegimen() {
      return conceptService.getConcept(therapeuticLineQuestion.firstLine)
        .then(therapeuticLine => {
          return {therapeuticLine, regime: null, arvPlan: null};
        });
    }

    // TODO implement endpoint for current patient regimen
    function getPatientRegimen(patient) {
      return getAllPrescriptions(patient)
        .then(prescriptions => {
          const artPrescriptions = prescriptions.filter(p => !!p.arvPlan);
          const latest = artPrescriptions[0];
          if (latest) {
            return {therapeuticLine: latest.therapeuticLine, regime: latest.regime, arvPlan: latest.arvPlan};
          } else {
            return getFirstTherapeuticLineRegimen();
          }
        });
    }

    /**
     * Creates a prescription.
     *
     * @param {Object} prescription Prescription to create.
     * @returns {Promise}
     */
    function create(prescription) {
      return $http.post(Bahmni.Common.Constants.prescriptionUrl, prescription, {
        withCredentials: true,
        headers: {"Accept": "application/json", "Content-Type": "application/json"}
      }).then(response => response.data).catch(error => {
        $log.error('XHR Failed for create: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

     function getAllPrescriptions(patient) {
       const config = {params: {patient: patient.uuid, findAllPrescribed: true, v: "full"}};
       return $http.get(Bahmni.Common.Constants.prescriptionUrl, config)
         .then(response => _.map(response.data.results, prescriptionMapper))
         .catch(error => {
           $log.error('XHR Failed for getAllPrescription: ' + error.data.error.message);
           return $q.reject(error);
         });
     }

     function stopPrescriptionItem(drugorder, reason) {

        return $http.delete(Bahmni.Common.Constants.drugOrderResourceUrl + "/" + drugorder.uuid, {
            params: {reason: reason}
        });
     }

    function getRegimensByTherapeuticLine(patient, therapeuticLine) {
      const representation = 'custom:(uuid,display,setMembers:(uuid,display,answers:(uuid,display))';
      return conceptService.getConcept(arvRegimensConvSet, representation)
        .then(concept => filterRegimes(concept.setMembers, therapeuticLine, patient));
    }

    function isArtPlanInterrupt(artPlan) {
      return artPlan.uuid === artInterruptedPlanUuid;
    }

    function filterRegimes(allRegimes, therapeuticLine, patient) {
      const age = (patient.age.years >= 15) ? "adult" : "child";
      const regimenGroupAge = regimenGroups[age];
      let regimenGroupTLine = {};

      if (therapeuticLine.uuid === therapeuticLineQuestion.firstLine) {
        regimenGroupTLine = regimenGroupAge.firstLine;
      }
      else if (therapeuticLine.uuid === therapeuticLineQuestion.secondLine) {
        regimenGroupTLine = regimenGroupAge.secondLine;
      }
      else if (therapeuticLine.uuid === therapeuticLineQuestion.thirdLine) {
        regimenGroupTLine = regimenGroupAge.thirdLine;
      }
      return _.find(allRegimes, member => member.uuid === regimenGroupTLine);
    }


    /**
     * Maps pharmacy-api Prescription.
     *
     * @param prescription
     */
    function prescriptionMapper(prescription) {
      prescription.prescriptionDate = new Date(prescription.prescriptionDate);
      prescription.prescriptionItems = prescription.prescriptionItems.map(i => {
        i.statusStranslate = getStatusStranslate(i);
        i.interruptible = isItemInterruptible(i);
        i.cancellable = (i.interruptible || i.status === 'NEW') && i.status !== 'EXPIRED';
        return i;
      });
      return prescription;
    }

    function getStatusStranslate(item){

      if(item.status === 'FINALIZED'){
        return "PRESCRIPTION_FINALIZED";
      }
      if(item.status === 'EXPIRED'){
        return "PRESCRIPTION_EXPIRED";
      }
      if(item.status === 'INTERRUPTED'){
        return "PRESCRIPTION_INTERRUPTED";
      }
      return "PRESCRIPTION_ACTIVE";
    }

    function isItemInterruptible(item){
      return (item.drugOrder.action === 'REVISE' || item.drugOrder.action === 'DISCONTINUE' || item.status === 'FINALIZED') && item.status != 'INTERRUPTED' && item.regime != null;
    }

  }

})();
