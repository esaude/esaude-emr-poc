(function () {
  'use strict';

  angular
    .module('application')
    .factory('applicationService', applicationService);

  applicationService.$inject = ['$http', '$log', 'authorizationService'];

  function applicationService($http, $log, authorizationService) {

    var APP_URL = "../common/application/resources/app.json";

    var service = {
      getApps: getApps
    };
    return service;

    ////////////////

    function getApps() {
      return $http.get(APP_URL)
        .then(function (response) {
          return authorizationService.authorizeApps(response.data.applications);
        })
        .catch(function (error) {
          $log.error("The async call has fail to: " + APP_URL);
        });
    }
  }

})();
