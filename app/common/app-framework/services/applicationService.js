(() => {
  'use strict';

  angular
    .module('bahmni.common.appFramework')
    .factory('applicationService', applicationService);

  applicationService.$inject = ['$http', '$log'];

  /* @ngInject */
  function applicationService($http, $log) {

    var APP_URL = "../common/application/resources/app.json";

    var service = {
      getApps: getApps
    };
    return service;

    ////////////////

    function getApps() {
      return $http.get(APP_URL)
        .then(response => response.data.applications)
        .catch(error => {
          $log.error("The async call has fail to: " + APP_URL);
        });
    }
  }

})();
