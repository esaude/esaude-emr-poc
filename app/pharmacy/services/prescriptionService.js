(function () {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('prescriptionService', prescriptionService);

  prescriptionService.$inject = ['$http', '$q', '$log'];

  function prescriptionService($http, $q, $log) {
    return {
      getPatientPrescriptions: getPatientPrescriptions
    };

    ////////////////

    /**
     * @param {String} patientUuid
     * @returns {Array} Prescriptions for patient.
     */
    function getPatientPrescriptions(patientUuid) {
      return $http.get(Bahmni.Common.Constants.prescriptionUrl, {

        params: {
          patient: patientUuid
        },

        withCredentials: true
      }).then(function (response) {
        return _.map(response.data.results, prescriptionMapper);
      }).catch(function (error) {
        $log.error('XHR Failed for getPatientPrescriptions. ' + error.data);
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
