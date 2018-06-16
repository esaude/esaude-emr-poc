(function () {
  'use strict';

  angular
    .module('common.patient')
    .factory('patientService', patientService);

  /* @ngInject */
  function patientService($http, $rootScope, appService, openmrsPatientMapper, $q, $log, reportService, updatePatientMapper,
                          additionalPatientAttributes) {

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
        .then(function (response) {
          return response.data.results;
        })
        .catch(function (error) {
          $log.error('XHR Failed for search: ' + error.data.error.message);
          return $q.reject(error);
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

    function createPatientProfile(patient) {
      // TODO validation does not work, missing Bahmni.Regsitration.customValidators
      var errMsg = Bahmni.Common.Util.ValidationUtil.validate(patient, appService.getPatientConfiguration());
      if(errMsg){
        return $q.reject(errMsg);
      }
      var patientJson = new Bahmni.Registration.CreatePatientRequestMapper(moment()).mapFromPatient(appService.getPatientConfiguration(), patient);
      return $http.post(BASE_OPENMRS_REST_URL + "/patientprofile", patientJson)
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          $log.error('XHR Failed for createPatientProfile: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function updatePatientProfile(patient, openMRSPatient) {

      var patientJson = updatePatientMapper.map(appService.getPatientConfiguration(), openMRSPatient, patient, moment());

      var updatedPatientProfile = {};

      return $http.post(BASE_OPENMRS_REST_URL + "/patientprofile/" + openMRSPatient.uuid, patientJson.patient)
        .then(function (response) {
          updatedPatientProfile = response.data;
        }).then(function () {
          return $q.all(patientJson.addedIdentifiers.map(function (i) {
            return createPatientIdentifier(patient, i);
          }));
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
          $log.error('XHR Failed for updatePatientProfile: ' + error.data.error.message);
          return $q.reject();
        });
    }

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

    function getPersonAttributesForStep (step) {
      var attributes = appService.getPatientConfiguration();
      var stepConfigAttrs = additionalPatientAttributes[step];
      if (!stepConfigAttrs) {
        throw new Error(`No additional person attributes for step ${step}`);
      }
      return _.intersectionBy(attributes, stepConfigAttrs, 'uuid');
    }
  }

})();
