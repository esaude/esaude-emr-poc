(function () {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('conceptService', conceptService);

  conceptService.$inject = ['$http', '$log', '$q'];

  function conceptService($http, $log, $q) {

    var service = {
      get: get,
      getPrescriptionConvSetConcept: getPrescriptionConvSetConcept
    };

    return service;

    ////////////////

    function get(concept) {
      return $http.get('/openmrs/ws/rest/v1/concept/' + concept, {
        params: {
          v: "full"
        },
        withCredentials: true
      });
    }

    function getPrescriptionConvSetConcept() {
      var concept = Bahmni.Common.Constants.prescriptionConvSetConcept;
      return get(concept)
        .then(function (response) {
          return response.data.setMembers;
        })
        .catch(function (error) {
          $log.error('XHR Failed for getPrescriptionConvSetConcept: ' + error.data.error.message);
          return $q.reject(error);
        });
    }
  }

})();
