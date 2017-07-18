(function () {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('prescriptionService', prescriptionService);

  prescriptionService.$inject = ['$http', '$q', '$log'];

  function prescriptionService($http, $q, $log) {
    return {
      getPatientNonDispensedPrescriptions: getPatientNonDispensedPrescriptions,
      create:create
    };

    ////////////////

    /**
     * Returns prescriptions not fully dispensed for patient.
     *
     * @param {String} patientUuid
     * @returns {Array} Prescriptions for patient.
     */
    function getPatientNonDispensedPrescriptions(patientUuid) {
      return $http.get(Bahmni.Common.Constants.prescriptionUrl, {

        params: {
          patient: patientUuid,
          v: "full"
        },

        withCredentials: true
      }).then(function (response) {
        return _.map(response.data.results, prescriptionMapper);
      }).catch(function (error) {
        $log.error('XHR Failed for getPatientNonDispensedPrescriptions. ' + error.data);
        return $q.reject(error);
      });
    }


       function create(prescription) {
          return $http.post(Bahmni.Common.Constants.prescriptionUrl, prescription, {
            withCredentials: true,
            headers: {"Accept": "application/json", "Content-Type": "application/json"}
          });
      }

    /**
     * Maps OpenMRS Prescription.
     *
     * @param prescription
     */
    function prescriptionMapper(prescription) {
      prescription.prescriptionDate = new Date(prescription.prescriptionDate);
      return prescription;
    }
  }

})();
