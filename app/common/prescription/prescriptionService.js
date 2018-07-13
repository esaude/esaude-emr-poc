(() => {
  'use strict';

  angular
    .module('poc.common.prescription')
    .factory('prescriptionService', prescriptionService);

  function prescriptionService($http, $q, $log, conceptService, observationsService, prescriptionConvSetConceptUUID,
                               drugPrescriptionConvSet, therapeuticLineQuestion, arvRegimensConvSet, regimenGroups,
                               arvConceptUuid, artInterruptedPlanUuid) {

    var sortByEncounterDateTime = _.curryRight(_.sortBy, 2)(encounter => encounter.encounterDatetime);

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
      var representation = 'custom:(uuid,display,setMembers:(uuid,display,answers:(uuid,display)))';
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
        var mapPrescription = _.curryRight(_.map)(prescriptionMapper);
        return _.flow([mapPrescription, sortByEncounterDateTime])(response.data.results);
      }).catch(error => {
        $log.error('XHR Failed for getPatientNonDispensedPrescriptions: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

    function getPatientRegimen(patient) {
      return $q.all([getPatientTherapeuticLine(patient), getPatientDrugRegimen(patient), getPatientArtPlan(patient)])
        .then(([therapeuticLine, drugRegimen, artPlan]) => {
          return {therapeuticLine, drugRegimen, artPlan};
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
       var config = {params: {patient: patient.uuid, findAllPrescribed: true, v: "full"}};
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

    function getPatientArtPlan(patient) {
      var prescriptionConvSet = {};
      var representation = 'custom:(uuid,display,value)';
      return getPrescriptionConvSetConcept()
        .then(convSet => prescriptionConvSet = convSet)
        .then(() => observationsService.getLastPatientObs(patient, drugPrescriptionConvSet.artPlan, representation))
        .then(artPlan => prescriptionConvSet.artPlan.answers.find(a => a.uuid === artPlan.value.uuid));
    }

     function getPatientDrugRegimen(patient) {
       var representation = 'custom:(uuid,display,value:(uuid,display))';
       return observationsService.getLastPatientObs(patient, {uuid: arvConceptUuid}, representation)
          .then(lastObs => lastObs.value);
     }

    function getPatientTherapeuticLine(patient) {
      var representation = 'custom:(uuid,display,value)';
      return observationsService.getLastPatientObs(patient, drugPrescriptionConvSet.therapeuticLine, representation)
        .then(lastTherapeuticLine => {
          return conceptService.getConcept(lastTherapeuticLine.value.uuid || therapeuticLineQuestion.firstLine, 'custom:(uuid,display)');
        });

    }

    function getRegimensByTherapeuticLine(patient, therapeuticLine) {
      var representation = 'custom:(uuid,display,setMembers:(uuid,display,answers:(uuid,display))';
      return conceptService.getConcept(arvRegimensConvSet, representation)
        .then(concept => filterRegimes(concept.setMembers, therapeuticLine, patient));
    }

    function isArtPlanInterrupt(artPlan) {
      return artPlan.uuid === artInterruptedPlanUuid;
    }

    function filterRegimes(allRegimes, therapeuticLine, patient) {
      var age = (patient.age.years >= 15) ? "adult" : "child";
      var regimenGroupAge = regimenGroups[age];
      var regimenGroupTLine = {};

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
