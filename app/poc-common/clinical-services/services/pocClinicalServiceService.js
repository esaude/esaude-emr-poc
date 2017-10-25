(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices')
    .factory('pocClinicalServiceService', pocClinicalServiceService);

  pocClinicalServiceService.$inject = ['$http'];

  /* @ngInject */
  function pocClinicalServiceService($http) {
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
