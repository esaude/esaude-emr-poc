(function () {
  'use strict';

  angular
    .module('common.patient')
    .factory('patientService', patientService);

  patientService.$inject = ['$http', '$rootScope', 'openmrsPatientMapper', '$q', '$log', 'reportService', 'prescriptionService', 'updatePatientMapper'];

  function patientService($http, $rootScope, openmrsPatientMapper, $q, $log, reportService, prescriptionService, updatePatientMapper) {

    var OPENMRS_URL = Poc.Patient.Constants.openmrsUrl;

    var BASE_OPENMRS_REST_URL = Poc.Patient.Constants.baseOpenMRSRESTURL;

    var OPENMRS_PATIENT_URL = OPENMRS_URL + "/ws/rest/v1/patient/";

    return {
      create: create,
      getIdentifierTypes: getIdentifierTypes,
      getPatient: getPatient,
      getOpenMRSPatient: getOpenMRSPatient,
      printPatientARVPickupHistory: printPatientARVPickupHistory,
      search: search,
      update: update,
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
        params: {v: "full"},
        withCredentials: true
      }).then(function (response) {
        return response.data.results;
      })
      .catch(function (error) {
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
        params: {v: representation || "full"},
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
      return $http.delete(OPENMRS_PATIENT_URL + patient.uuid + "/identifier/" + identifier.uuid).then(function (response) {
        return response.data;
      }).catch(function (error) {
        $log.error('XHR Failed for deletePatientIdentifier: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

    function updatePatientIdentifier(patientUuid, identifier) {
      var data = {uuid: identifier.uuid, identifier: identifier.identifier, preferred: identifier.preferred};
      return $http.post(OPENMRS_PATIENT_URL + patientUuid + "/identifier/" + identifier.uuid, data).then(function (response) {
        return response.data;
      }).catch(function (error) {
        $log.error('XHR Failed for updatePatientIdentifier: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

    function createPatientIdentifier(patient, identifier) {
      delete identifier.selectedIdentifierType;
      delete identifier.fieldName;
      return $http.post(OPENMRS_PATIENT_URL + patient.uuid + "/identifier/", identifier).then(function (response) {
        return response.data;
      }).catch(function (error) {
        $log.error('XHR Failed for createPatientIdentifier: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

    function create(patient) {
      var patientJson = new Bahmni.Registration.CreatePatientRequestMapper(moment()).mapFromPatient($rootScope.patientConfiguration.personAttributeTypes, patient);
      return $http.post(BASE_OPENMRS_REST_URL + "/patientprofile", patientJson, {
        withCredentials: true,
        headers: {"Accept": "application/json", "Content-Type": "application/json"}
      });
    }

    function update(patient, openMRSPatient) {

      var patientJson = updatePatientMapper.map($rootScope.patientConfiguration.personAttributeTypes, openMRSPatient, patient, moment());

      var updatedPatientProfile = {};

      return $http.post(BASE_OPENMRS_REST_URL + "/patientprofile/" + openMRSPatient.uuid, patientJson.patient)
        .then(function (response) {
          updatedPatientProfile = response.data;
        }).then(function () {
          return $q.all(patientJson.addedIdentifiers.map(function (i) {
            return createPatientIdentifier(patient, i);
          }))
        }).then(function () {
          return $q.all(patientJson.voidedIdentifiers.map(function (i) {
            return deletePatientIdentifier(openMRSPatient, i);
          }));
        }).then(function () {
          return $q.all(patientJson.changedIdentifiers.map(function (i) {
            return updatePatientIdentifier(openMRSPatient.uuid, i);
          }));
        }).then(function (updatedIdentifiers) {
          updatedPatientProfile.patient.identifiers.forEach(function (old) {
            var novo = updatedIdentifiers.find(function (i) {
              return old.uuid === i.uuid;
            });
            if (novo) {
              old.identifier = novo.identifier;
              old.preferred = novo.preferred;
            }
          });
          return updatedPatientProfile;
        }).catch(function (error) {
          $log.error('XHR Failed for update: ' + error.data.error.message);
          return $q.reject();
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

    /**
     * @param {String} patientUuid The patient UUID.
     * @param {String} [representation] The resource representation.
     * @returns {Promise}
     */
    function getPatient(patientUuid, representation) {
      return get(patientUuid, representation).then(function (response) {
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
    function printPatientARVPickupHistory(year, patientUuid, pickups) {
      var _getPatient = getPatient(patientUuid);
      var getPrescriptions = prescriptionService.getPatientNonDispensedPrescriptions(patientUuid);

      $q.all([_getPatient, getPrescriptions]).then(function (values) {
        var patient = values[0];
        patient.pickups = pickups;
        patient.prescriptions = _.filter(values[1], function (p) {
          return p.prescriptionDate.getFullYear() === year;
        });
        reportService.printPatientARVPickupHistory(patient);
      });
    }

    function updatePerson(personUuid, patientState) {
      return $http.post(BASE_OPENMRS_REST_URL+"/person/"+personUuid , patientState)
        .then(function (response) {
          $log.info('XHR Succed for updatePerson. ' + response);
        })
        .catch(function (error) {
          $log.error('XHR Failed for updatePerson. ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function voidPatient(patientUuid, reason){
      return $http.delete(OPENMRS_PATIENT_URL+ patientUuid + "?reason="+ reason )
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
