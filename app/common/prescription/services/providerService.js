(function () {
  'use strict';

  angular
    .module('common.prescription')
    .factory('providerService', providerService);

  providerService.$inject = ['$http', '$log'];

  /* @ngInject */
  function providerService($http, $log) {
    var service = {
      getProviders: getProviders
    };
    return service;

    ////////////////

    function getProviders() {
      return $http
        .get("/openmrs/ws/rest/v1/provider").then(function (response) {
          return response.data.results;
        })
        .catch(function (err) {
          $log.error('XHR Failed for getLastPatientPrescription. ' + error.data);
          return $q.reject(err);
        });
    }

  }

})();

