(() => {
  'use strict';

  angular
    .module('common.patient')
    .factory('patientService', patientService);

  /* @ngInject */
  function patientService($http, appService, openmrsPatientMapper, $q, $log, reportService, updatePatientMapper,
    additionalPatientAttributes, patientRepresentation) {

    var OPENMRS_URL = Poc.Patient.Constants.openmrsUrl;

    var BASE_OPENMRS_REST_URL = Poc.Patient.Constants.baseOpenMRSRESTURL;

    var OPENMRS_PATIENT_URL = OPENMRS_URL + "/ws/rest/v1/patient/";

    return {
      createPatientProfile: createPatientProfile,
      getIdentifierTypes: getIdentifierTypes,
      getPatient: getPatient,
      getOpenMRSPatient: getOpenMRSPatient,
      printPatientARVPickupHistory: printPatientARVPickupHistory,
      search: search,
      updatePatientProfile: updatePatientProfile,
      voidPatient: voidPatient,
      updatePerson: updatePerson,
      getPersonAttributesForStep: getPersonAttributesForStep,
    };

    ////////////////

    function search(query, representation) {
      var config = {
        params: {
          q: query,
          identifier: query,
          v: representation || "full"
        }
      };
      return $http.get(OPENMRS_PATIENT_URL, config)
        .then(response => response.data.results)
        .catch(error => {
          $log.error('XHR Failed for search: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function getIdentifierTypes() {
      return $http.get(OPENMRS_URL + "/ws/rest/v1/patientidentifiertype", {
        method: "GET",
        params: { v: "full" },
        withCredentials: true
      }).then(response => response.data.results)
        .catch(error => {
          $log.error('XHR Failed for getIdentifierTypes: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    /**
     * @param {String} uuid The patient UUID.
     * @param {String} [representation] The resource representation.
     * @returns {Promise}
     */
    function get(uuid, representation) {
      return $http.get(OPENMRS_PATIENT_URL + uuid, {
        method: "GET",
        params: { v: representation || "full" },
        withCredentials: true
      });
    }

    function getPatientIdentifiers(patientUuid) {
      return $http.get(OPENMRS_PATIENT_URL + patientUuid + "/identifier", {
        method: "GET",
        withCredentials: true
      });
    }

    function deletePatientIdentifier(patient, identifier) {
      return $http.delete(OPENMRS_PATIENT_URL + patient.uuid + "/identifier/" + identifier.uuid).then(response => response.data).catch(error => {
        $log.error('XHR Failed for deletePatientIdentifier: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

    function updatePatientIdentifier(patientUuid, identifier) {
      var data = { uuid: identifier.uuid, identifier: identifier.identifier, preferred: identifier.preferred };
      return $http.post(OPENMRS_PATIENT_URL + patientUuid + "/identifier/" + identifier.uuid, data).then(response => response.data).catch(error => {
        $log.error('XHR Failed for updatePatientIdentifier: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

    function createPatientIdentifier(patient, identifier) {
      delete identifier.selectedIdentifierType;
      delete identifier.fieldName;
      return $http.post(OPENMRS_PATIENT_URL + patient.uuid + "/identifier/", identifier).then(response => response.data).catch(error => {
        $log.error('XHR Failed for createPatientIdentifier: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

    function createPatientProfile(patient) {
      var nid = getPatientNid(patient);
      return search(nid.identifier).then(patients => {
        if (patients.length === 0) {
          var patientJson = new Bahmni.Registration.CreatePatientRequestMapper(moment()).mapFromPatient(appService.getPatientConfiguration(), patient);
          return $http.post(BASE_OPENMRS_REST_URL + "/patientprofile", patientJson)
            .then(response => response.data);
        } else {
          return $q.reject({
            errorType: "PATIENT_WITH_SAME_NID_EXISTS",
            nid: nid.identifier
          });
        }
      });

    }

    function getPatientNid(patient) {
      var nid = patient.identifiers.find(identifier => {
        return identifier.identifierType.uuid === Bahmni.Common.Constants.identifierTypesUuids.nid;
      });
      return nid;
    }

    function updatePatientProfile(patient, openMRSPatient) {

      var patientJson = updatePatientMapper.map(appService.getPatientConfiguration(), openMRSPatient, patient, moment());

      var updatedPatientProfile = {};

      return $http.post(BASE_OPENMRS_REST_URL + "/patientprofile/" + openMRSPatient.uuid, patientJson.patient)
        .then(response => {
          updatedPatientProfile = response.data;
        }).then(() => $q.all(patientJson.addedIdentifiers.map(i => createPatientIdentifier(patient, i)))).then(() => $q.all(patientJson.voidedIdentifiers.map(i => deletePatientIdentifier(openMRSPatient, i)))).then(() => $q.all(patientJson.changedIdentifiers.map(i => updatePatientIdentifier(openMRSPatient.uuid, i)))).then(updatedIdentifiers => {
          updatedPatientProfile.patient.identifiers.forEach(old => {
            var novo = updatedIdentifiers.find(i => old.uuid === i.uuid);
            if (novo) {
              old.identifier = novo.identifier;
              old.preferred = novo.preferred;
            }
          });
          return updatedPatientProfile;
        }).catch(error => {
          $log.error('XHR Failed for updatePatientProfile: ' + error.data.error.message);
          return $q.reject();
        });
    }

    function getOpenMRSPatient(patientUUID) {
      return get(patientUUID).then(response => response.data).catch(error => {
        $log.error('XHR Failed for getOpenMRSPatient: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

    /**
     * @param {String} patientUuid The patient UUID.
     * @param {String} [representation] The resource representation.
     * @returns {Promise}
     */
    function getPatient(patientUuid, {representation = patientRepresentation} = {}) {
      return get(patientUuid, representation).then(response => openmrsPatientMapper.map(response.data)).catch(error => {
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
      $q.all([_getPatient]).then(values => {
        var patient = values[0];
        patient.dispensations = groupedDispensations;
        patient.startDate = startDate;
        patient.endDate = endDate;
        reportService.printPatientARVPickupHistory(patient);
      });
    }

    function updatePerson(personUuid, patientState) {
      return $http.post(BASE_OPENMRS_REST_URL + "/person/" + personUuid, patientState)
        .then(response => {
          $log.info('XHR Succed for updatePerson. ' + response);
        })
        .catch(error => {
          $log.error('XHR Failed for updatePerson. ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function voidPatient(patientUuid, reason) {
      return $http.delete(OPENMRS_PATIENT_URL + patientUuid + "?reason=" + reason)
        .then(response => {
          $log.info('XHR Succed for voidPatient. ');
        })
        .catch(error => {
          $log.error('XHR Failed for voidPatient. ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function getPersonAttributesForStep(step) {
      var attributes = appService.getPatientConfiguration();
      var stepConfigAttrs = additionalPatientAttributes[step];
      if (!stepConfigAttrs) {
        throw new Error(`No additional person attributes for step ${step}`);
      }
      return _.intersectionBy(attributes, stepConfigAttrs, 'uuid');
    }
  }

})();
