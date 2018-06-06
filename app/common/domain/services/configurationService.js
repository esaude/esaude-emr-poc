(function () {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('configurationService', configurationService);

  function configurationService($http, $log, $q) {

    return {
      getConfigurations: getConfigurations,
      getDefaultLocation: getDefaultLocation,
      getAddressLevels: getAddressLevels,
      getPatientAttributeTypes: getPatientAttributeTypes,
    };

    function getConfigurations(configurationNames) {

      var configurationFunctions = {
        relationshipTypeConfig: relationshipTypeConfig,
      };

      var promises = configurationNames.map(function (configurationName) {
        return configurationFunctions[configurationName]().then(function (response) {
          return response.data;
        });
      });

      return $q.all(promises);
    }

    function getPatientAttributeTypes() {
      return $http.get(Bahmni.Common.Constants.personAttributeTypeUrl, {params: {v: "full"}})
        .then(function (response) {
          return response.data.results;
        })
        .catch(function (error) {
          $log.error('XHR Failed for getPatientAttributeTypes: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function getAddressLevels() {
      return $http.get(Bahmni.Common.Constants.openmrsUrl + "/module/addresshierarchy/ajax/getOrderedAddressHierarchyLevels.form")
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          $log.error('XHR Failed for getAddressLevels: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function getDefaultLocation() {
      return $http.get("/openmrs/ws/rest/v1/systemsetting", {params: {q: 'default_location', v: 'custom:(value)'}})
        .then(function (response) {
          return response.data.results[0].value;
        })
        .catch(function (error) {
          $log.error('XHR Failed for getDefaultLocation: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function relationshipTypeConfig() {
      return $http.get(Bahmni.Common.Constants.relationshipTypesUrl, {
        withCredentials: true,
        params: {v: "custom:(aIsToB,uuid)"}
      });
    }
  }

})();
