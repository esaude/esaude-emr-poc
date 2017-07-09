(function () {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('prescriptionService', prescriptionService);

  prescriptionService.$inject = ['$http', '$q', '$log'];

  function prescriptionService($http, $q, $log) {
    return {
      getPatientNonDispensedPrescriptions: getPatientNonDispensedPrescriptions
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
          patient: patientUuid
        },

        withCredentials: true
      }).then(function (response) {
        return _.map(response.data.results, prescriptionMapper);
      }).catch(function (error) {
        $log.error('XHR Failed for getPatientNonDispensedPrescriptions. ' + error.data);
        return $q.reject(error);
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
