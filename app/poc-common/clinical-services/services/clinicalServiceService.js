(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices')
    .factory('clinicalServiceService', clinicalServiceService);

  clinicalServiceService.$inject = ['$http', '$log', '$q'];

  /* @ngInject */
  function clinicalServiceService($http, $log, $q) {
    var service = {
      deleteService: deleteService
    };
    return service;

    ////////////////

    function deleteService(service, encounter) {
      return $http.get('/openmrs/ws/rest/v1/clinicalservice', {
        params: {
          clinicalservice: service,
          encounter: encounter
        },
        withCredentials: true
      });
    }
  }

})();
