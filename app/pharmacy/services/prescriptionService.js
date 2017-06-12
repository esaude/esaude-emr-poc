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
        return response.data;
      }).catch(function (error) {
        $log.error('XHR Failed for getPatientPrescriptions. ' + error.data);
        return $q.reject(error);
      });
    }
  }

})();
