(function () {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('prescriptionService', prescriptionService);

  prescriptionService.$inject = ['$http', '$q', '$log'];

  function prescriptionService($http, $q, $log) {

    var sortByEncounterDateTime = _.curryRight(_.sortBy, 2)(function (encounter) {
      return encounter.encounterDatetime;
    });

    return {
       create: create,
       stopPrescriptionItem: stopPrescriptionItem,
       getAllPrescriptions: getAllPrescriptions,
       getPatientNonDispensedPrescriptions: getPatientNonDispensedPrescriptions
    };

    ////////////////


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
      }).then(function (response) {
        var mapPrescription = _.curryRight(_.map)(prescriptionMapper);
        return _.flow([mapPrescription, sortByEncounterDateTime])(response.data.results);
      }).catch(function (error) {
        $log.error('XHR Failed for getPatientNonDispensedPrescriptions: ' + error.data.error.message);
        return $q.reject(error);
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
      }).then(function (response) {
        return response.data;
      }).catch(function (error) {
        $log.error('XHR Failed for create: ' + error.data.error.message);
        return $q.reject();
      });
    }

     function getAllPrescriptions(patient) {

        return $http.get(Bahmni.Common.Constants.prescriptionUrl, {
          params: {
            patient: patient.uuid,
            findAllPrescribed: true,
            v: "full"
          },
          withCredentials: true
          }).then(function (response) {
            return _.map(response.data.results, prescriptionMapper);
          }).catch(function (error) {
            $log.error('XHR Failed for getAllPrescription: ' + error.data.error.message);
            return $q.reject(error);
          });
     }

     function stopPrescriptionItem(drugorder, reason) {

        return $http.delete(Bahmni.Common.Constants.drugOrderResourceUrl + "/" + drugorder.uuid, {
            params: {reason: reason}
        });
     }


    /**
     * Maps pharmacy-api Prescription.
     *
     * @param prescription
     */
    function prescriptionMapper(prescription) {
      prescription.prescriptionDate = new Date(prescription.prescriptionDate);
      return prescription;
    }

  }

})();
