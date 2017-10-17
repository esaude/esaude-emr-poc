(function () {
  'use strict';

  angular
    .module('common.patient')
    .factory('patientService', patientService);

  patientService.$inject = ['$http', '$rootScope', 'openmrsPatientMapper', '$q', '$log', 'reportService', 'prescriptionService', 'dispensationService'];

  function patientService($http, $rootScope, openmrsPatientMapper, $q, $log, reportService, prescriptionService, dispensationService) {

    var OPENMRS_URL = Poc.Patient.Constants.openmrsUrl;

    var BASE_OPENMRS_REST_URL = Poc.Patient.Constants.baseOpenMRSRESTURL;

    var OPENMRS_PATIENT_URL = OPENMRS_URL + "/ws/rest/v1/patient/";

    return {
      create: create,
      getIdentifierTypes: getIdentifierTypes,
      getPatient: getPatient,
      getPatientIdentifiers: getPatientIdentifiers,
      getOpenMRSPatient: getOpenMRSPatient,
      printPatientARVPickupHistory: printPatientARVPickupHistory,
      search: search,
      update: update,
      updatePatientIdentifier: updatePatientIdentifier,
      voidPatient: voidPatient,
      updatePerson: updatePerson
    };

    ////////////////

    function search(query) {
      return $http.get(OPENMRS_PATIENT_URL, {
        method: "GET",
        params: {
          q: query,
          identifier: query,
          v: "full"
        },
        withCredentials: true
      });
    }

    function getIdentifierTypes() {
      return $http.get(OPENMRS_URL + "/ws/rest/v1/patientidentifiertype", {
        method: "GET",
        params: { v: "full" },
        withCredentials: true
      }).then(function (response) {
        return response.data.results;
      })
        .catch(function (error) {
          $log.error('XHR Failed for getIdentifierTypes: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function get(uuid) {
      return $http.get(OPENMRS_PATIENT_URL + uuid, {
        method: "GET",
        params: { v: "full" },
        withCredentials: true
      });
    }

    function getPatientIdentifiers(patientUuid) {
      return $http.get(OPENMRS_PATIENT_URL + patientUuid + "/identifier", {
        method: "GET",
        withCredentials: true
      });
    }

    function updatePatientIdentifier(patientUuid, identifierUuid, identifier) {
      return $http.post(OPENMRS_PATIENT_URL + patientUuid + "/identifier/" + identifierUuid, identifier, {
        withCredentials: true,
        headers: { "Accept": "application/json", "Content-Type": "application/json" }
      });
    }

    function create(patient) {
      var patientJson = new Bahmni.Registration.CreatePatientRequestMapper(moment()).mapFromPatient($rootScope.patientConfiguration.personAttributeTypes, patient);
      return $http.post(BASE_OPENMRS_REST_URL + "/patientprofile", patientJson, {
        withCredentials: true,
        headers: { "Accept": "application/json", "Content-Type": "application/json" }
      });
    }

    function update(patient, openMRSPatient) {
      var patientJson = new Bahmni.Registration.UpdatePatientRequestMapper(moment()).mapFromPatient($rootScope.patientConfiguration.personAttributeTypes, openMRSPatient, patient);
      return $http.post(BASE_OPENMRS_REST_URL + "/patientprofile/" + openMRSPatient.uuid, patientJson, {
        withCredentials: true,
        headers: { "Accept": "application/json", "Content-Type": "application/json" }
      });
    }

    //This is needed because of updatePatientRequestMapper.
    function getOpenMRSPatient(patientUUID) {
      return get(patientUUID).then(function (response) {
        return response.data;
      }).catch(function (error) {
        $log.error('XHR Failed for getOpenMRSPatient: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

    function getPatient(patientUuid) {
      return get(patientUuid).then(function (response) {
        return openmrsPatientMapper.map(response.data);
      }).catch(function (error) {
        $log.error('XHR Failed for getPatient: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

    /**
     * Prints the patient pickup history report filtered by year.
     *
     * @param {number} year
     * @param {String} patientUuid
     * @param {Array} pickups
     */
    function printPatientARVPickupHistory(patientUuid, groupedDispensations, startDate, endDate) {
      var _getPatient = getPatient(patientUuid);
      $q.all([_getPatient]).then(function (values) {
        var patient = values[0];
        patient.dispensations = groupedDispensations;
        patient.startDate = startDate;
        patient.endDate = endDate;
        reportService.printPatientARVPickupHistory(patient);
      });
    }

    function updatePerson(personUuid, patientState) {
      return $http.post(BASE_OPENMRS_REST_URL + "/person/" + personUuid, patientState)
        .then(function (response) {
          $log.info('XHR Succed for updatePerson. ' + response);
        })
        .catch(function (error) {
          $log.error('XHR Failed for updatePerson. ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function voidPatient(patientUuid, reason) {
      return $http.delete(OPENMRS_PATIENT_URL + patientUuid + "?reason=" + reason)
        .then(function (response) {
          $log.info('XHR Succed for voidPatient. ');
        })
        .catch(function (error) {
          $log.error('XHR Failed for voidPatient. ' + error.data.error.message);
          return $q.reject(error);
        });
    }
  }

})();
