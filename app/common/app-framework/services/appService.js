(function () {
  'use strict';

  angular
    .module('bahmni.common.appFramework')
    .factory('appService', appService);

  appService.$inject = ['$http', '$q', 'sessionService'];

  /* @ngInject */
  function appService($http, $q, sessionService) {

    var currentUser = null;
    var baseUrl = "/poc_config/openmrs/apps/";
    var appDescriptor = null;

    var service = {
      getAppDescriptor: getAppDescriptor,
      initApp: initApp,
      loadClinicalServices: loadClinicalServices
    };
    return service;

    ////////////////

    function getAppDescriptor() {
      return appDescriptor;
    }

    function initApp(appName, options) {
      var appLoader = $q.defer();
      var promises = [];
      var opts = options || {'app': true, 'extension': true, 'service': false};

      var inheritAppContext = (!opts.inherit) ? true : opts.inherit;

      appDescriptor = new Bahmni.Common.AppFramework.AppDescriptor(appName, inheritAppContext, function () {
        return currentUser;
      });

      var loadCredentialsPromise = sessionService.loadCredentials();
      promises.push(loadCredentialsPromise);

      if (opts.service) {
        promises.push(loadFormLayout(appDescriptor));
        promises.push(this.loadClinicalServices(appDescriptor));
        promises.push(loadDrugMapping(appDescriptor));
      }

      if (opts.app) {
        promises.push(loadDefinition(appDescriptor));
      }
      $q.all(promises).then(function (results) {
        currentUser = results[0];
        appLoader.resolve(appDescriptor);
      }, function (errors) {
        appLoader.reject(errors);
      });
      return appLoader.promise;
    }

    /**
     * Loads clinicalServices configured for current app.
     * NOTE: As this method will be decorated for authorization, inside appService always refer to it using
     * this.loadClinicalServices.
     * @param {Bahmni.Common.AppFramework.AppDescriptor} appDescriptor
     * @return {Promise}
     */
    function loadClinicalServices(appDescriptor) {
      return loadConfig(baseUrl  + appDescriptor.contextPath +  "/clinicalServices.json")
        .then(function (result) {
          appDescriptor.setClinicalServices(result.data);
          return appDescriptor;
        })
        .catch(function (error) {
          return error.status !== 404 ? $q.reject(error) : appDescriptor;
        });
    }

    function loadConfig(url) {
      return $http.get(url, {withCredentials: true});
    }

    function  loadFormLayout(appDescriptor) {
      var deferrable = $q.defer();
      loadConfig(baseUrl + "/common/formLayout.json").then(
        function (result) {
          appDescriptor.setFormLayout(result.data);

          deferrable.resolve(appDescriptor);
        },
        function (error) {
          if (error.status !== 404) {
            deferrable.reject(error);
          } else {
            deferrable.resolve(appDescriptor);
          }
        }
      );
      return deferrable.promise;
    }

    function loadDrugMapping(appDescriptor) {
      var deferrable = $q.defer();
      loadConfig(baseUrl + "/common/drugMapping.json").then(
        function (result) {
          appDescriptor.setDrugMapping(result.data);

          deferrable.resolve(appDescriptor);
        },
        function (error) {
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
        function (result) {
          if (result.data.length > 0) {
            appDescriptor.setDefinition(result.data[0]);
          }
          deferrable.resolve(appDescriptor);
        },
        function (error) {
          if (error.status !== 404) {
            deferrable.reject(error);
          } else {
            deferrable.resolve(appDescriptor);
          }
        }
      );
      return deferrable.promise;
    }
  }

})();
