(function () {
  'use strict';

  angular
    .module('lab')
    .factory('testOrderResultService', testOrderResultService);

  testOrderResultService.$inject = ['$http', '$q', '$log', 'sessionService'];

  /* @ngInject */
  function testOrderResultService($http, $q, $log, sessionService) {
    var service = {
      getTestOrderResultsForPatient: getTestOrderResultsForPatient,
      getTestOrderResult: getTestOrderResult,
      saveTestResultItem: saveTestResultItem,
      removeTestResultItem: removeTestResultItem
    };
    return service;

    ////////////////

    function getTestOrderResultsForPatient(patient) {
      return $http.get('/openmrs/ws/rest/v1/testorderresult', {params: {patient: patient.uuid}})
        .then(function (response) {
          return response.data.results;
        })
        .catch(function (error) {
          $log.error('XHR failed for getTestOrderResultsForPatient: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function getTestOrderResult(uuid) {
      return $http.get('/openmrs/ws/rest/v1/testorderresult/' + uuid)
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          $log.error('XHR failed for getTestResultItems: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function saveTestResultItem(testResult, testResultItem) {
      var config = {headers: {"Accept": "application/json", "Content-Type": "application/json"}};

      return sessionService.getCurrentProvider()
        .then(function (currentProvider) {
          return $http.post('/openmrs/ws/rest/v1/testorderresult', buildTestResultResource(currentProvider, testResult, testResultItem), config);
        })
        .then(function (response) {
          return response.data.items[0];
        })
        .catch(function (error) {
          $log.error('XHR failed for saveTestResultItem: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function removeTestResultItem(testResult, item) {
      return $http.delete('/openmrs/ws/rest/v1/testorderresult/' + testResult.uuid + '/item/' + item.uuid)
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          $log.error('XHR failed for removeTestResultItem: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function buildTestResultResource(provider, testResult, item) {
      return {
        encounterRequest: {uuid: testResult.encounterRequest.uuid},
        dateCreation: moment().format('YYYY-MM-DD'),
        provider: {uuid: provider.uuid},
        items: [
          {
            "testOrder": {"type": item.testOrder.type, "uuid": item.testOrder.uuid},
            "value": "" + item.value
          }
        ]
      };
    }

  }

})();
