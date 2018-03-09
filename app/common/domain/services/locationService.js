(function () {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('locationService', locationService);

  locationService.$inject = ['$http', '$q', '$log', 'configurationService'];

  /* @ngInject */
  function locationService($http, $q, $log, configurationService) {

    var HEALTH_FACILITY_CODE_ATTR_TYPE = '132895aa-1c88-11e8-b6fd-7395830b63f3';

    var service = {
      getAllByTag: getAllByTag,
      getLocationsByName: getLocationsByName,
      getDefaultLocation: getDefaultLocation
    };
    return service;

    ////////////////

    function getAllByTag(tags) {
      var config = {
        params: {s: "byTags", q: tags || ""},
        cache: true
      };
      return $http.get(Bahmni.Common.Constants.locationUrl, config)
        .then(function (response) {
          return response.data.results;
        })
        .catch(function (error) {
          $log.error('XHR Failed for getAllByTag: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function getLocationsByName(name) {
      var config = {
        params: {q: name, v: 'custom:uuid,display,attributes:(value,attributeType:(uuid,display))'},
        cache: true,
        withCredentials: false
      };
      return $http.get(Bahmni.Common.Constants.locationUrl, config)
        .then(function (response) {
          response.data.results.forEach(function (l) {
            var healthFacilityCode = l.attributes.find(function (attr) {
              return attr.attributeType.uuid === HEALTH_FACILITY_CODE_ATTR_TYPE;
            });
            l.code = healthFacilityCode ? healthFacilityCode.value : "";
          });
          return response.data.results;
        })
        .catch(function (error) {
          $log.error('XHR Failed for getLocationsByName: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function getDefaultLocation() {
      return configurationService.getConfigurations(['defaultLocation'])
        .then(function (configurations) {
          var defaultLocationConfig = configurations.defaultLocation.results[0];
          if (defaultLocationConfig.value) {
            return getLocationsByName(defaultLocationConfig.value);
          } else {
            return $q.reject('LOGIN_LABEL_LOGIN_ERROR_NO_DEFAULT_LOCATION');
          }
        })
        .then(function (locations) {
          var location = locations[0];
          if (location) {
            return location;
          } else {
            return $q.reject('LOGIN_LABEL_LOGIN_ERROR_INVALID_DEFAULT_LOCATION')
          }
        })
        .catch(function (error) {
          $log.error('XHR Failed for getDefaultLocation: ' + (error.data && error.data.error.message || error));
          return $q.reject(error);
        });
    }
  }

})();
