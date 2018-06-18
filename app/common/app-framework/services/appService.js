(() => {
  'use strict';

  angular
    .module('bahmni.common.appFramework')
    .factory('appService', appService);

  /* @ngInject */
  function appService($http, $q, sessionService, configurationService) {

    var currentUser = null;
    var baseUrl = "/poc_config/openmrs/apps/";
    var appDescriptor = null;
    var pocPatientConfig = null;

    var service = {
      initApp: initApp,
      getAppDescriptor: getAppDescriptor,
      getPatientConfiguration: getPatientConfiguration,
    };
    return service;

    ////////////////

    function getAppDescriptor() {
      return appDescriptor;
    }

    function initApp(appName, options) {
      var promises = [];
      var opts = options || {'app': true, 'extension': true, 'service': false};

      var inheritAppContext = (!opts.inherit) ? true : opts.inherit;

      appDescriptor = new Bahmni.Common.AppFramework.AppDescriptor(appName, inheritAppContext, () => currentUser);

      var loadCredentialsPromise = sessionService.loadCredentials();
      promises.push(loadCredentialsPromise);

      if (opts.service) {
        promises.push(loadDrugMapping(appDescriptor));
      }

      if (opts.app) {
        promises.push(loadDefinition(appDescriptor));
      }

      var appLoader = $q.all(promises)
        .then(results => {
          currentUser = results[0];
        })
        .then(() => loadPatientAttributeTypes())
        .then(() => appDescriptor);

      return appLoader;
    }

    function loadConfig(url) {
      return $http.get(url, {withCredentials: true});
    }

    function loadDrugMapping(appDescriptor) {
      var deferrable = $q.defer();
      loadConfig(baseUrl + "/common/drugMapping.json").then(
        result => {
          appDescriptor.setDrugMapping(result.data);

          deferrable.resolve(appDescriptor);
        },
        error => {
          if (error.status !== 404) {
            deferrable.reject(error);
          } else {
            deferrable.resolve(appDescriptor);
          }
        }
      );
      return deferrable.promise;
    }

    function loadDefinition(appDescriptor) {
      var deferrable = $q.defer();
      loadConfig(baseUrl + appDescriptor.contextPath + "/app.json").then(
        result => {
          if (result.data.length > 0) {
            appDescriptor.setDefinition(result.data[0]);
          }
          deferrable.resolve(appDescriptor);
        },
        error => {
          if (error.status !== 404) {
            deferrable.reject(error);
          } else {
            deferrable.resolve(appDescriptor);
          }
        }
      );
      return deferrable.promise;
    }


    // TODO: move to patientService load only when needed.
    function loadPatientAttributeTypes() {
      return configurationService.getPatientAttributeTypes()
        .then(patientAttributeTypes => {
          pocPatientConfig = patientAttributeTypes;
        })
        .catch(() => {
          $log.error('XHR Failed for loadPatientAttributeTypes: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function getPatientConfiguration() {
      if (!pocPatientConfig) {
        throw new Error('App not initialized');
      }
      return pocPatientConfig;
    }
  }

})();
