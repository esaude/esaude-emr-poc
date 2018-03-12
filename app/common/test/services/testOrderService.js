(function () {
  'use strict';

  angular
    .module('poc.common.clinicalservices')
    .factory('testOrderService', testOrderService);

  testOrderService.$inject = ['$http', '$log', '$q'];

  function testOrderService($http, $log, $q) {

    var OPENMRS_TEST_URL = "/openmrs/ws/rest/v1/testorder";

    var CONFIG = {
      method: "GET",
      params: { v: "full" },
      withCredentials: true
    };

    return {
      create: create,
      getTestOrdersByPatientUuid: getTestOrdersByPatientUuid,
      deleteTestOrder: deleteTestOrder
    };

    function create(testOrder) {
      return $http.post(OPENMRS_TEST_URL, testOrder, {
        withCredentials: true,
        headers: { "Accept": "application/json", "Content-Type": "application/json" }
      }).then(function (response) {
        return response.data;
      }).catch(function (error) {
        $log.error('XHR Failed for create: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

    function getTestOrdersByPatientUuid(patientUuid) {
      return $http.get(OPENMRS_TEST_URL + "?patient=" + patientUuid, CONFIG).then(function (response) {
        return response.data.results;
      });
    }

    function deleteTestOrder(encounterUuid, testUuid) {
      return $http.delete(OPENMRS_TEST_URL + "/" + encounterUuid + "/item/" + testUuid);
    }

  }

})();
