(function () {
  'use strict';

  angular
    .module('bahmni.common.domain')
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
          $log.error('XHR Failed for getProviders: ' + error.data.error.message);
          return $q.reject(err);
        });
    }

  }

})();

