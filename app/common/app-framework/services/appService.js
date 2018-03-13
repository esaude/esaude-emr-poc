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
      initApp: initApp
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

    function loadConfig(url) {
      return $http.get(url, {withCredentials: true});
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
