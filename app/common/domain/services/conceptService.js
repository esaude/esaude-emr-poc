(() => {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('conceptService', conceptService);

  conceptService.$inject = ['$http', '$log', '$q', 'orderService'];

  function conceptService($http, $log, $q, orderService) {

    var service = {
      get: get,
      getConcept: getConcept,
      getDeathConcepts: getDeathConcepts,
      searchBySource: searchBySource,
      getConceptByTestOrder: getConceptByTestOrder
    };

    return service;

    ////////////////

    /**
     * @deprecated {@see getConcept}
     * @param concept
     */
    function get(concept) {
      return $http.get('/openmrs/ws/rest/v1/concept/' + concept, {
        params: {
          v: "full"
        },
        withCredentials: true
      });
    }

    function getConcept(uuid, representation) {
      return $http.get('/openmrs/ws/rest/v1/concept/' + uuid, { params: { v: representation } })
        .then(response => response.data)
        .catch(error => {
          $log.error('XHR Failed for getConcept: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function getConceptByTestOrder(testOrderUuid, representation) {
      return orderService.getOrder(testOrderUuid)
        .then(order => getConcept(order.concept.uuid, representation))
        .catch(error => {
          $log.error('XHR Failed for getConceptByTestOrder: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function getDeathConcepts() {

      function filterRetireDeathConcepts(deathConcepts) {
        return _.filter(deathConcepts, concept => !concept.retired);
      }

      return $http.get(Bahmni.Common.Constants.systemSetting + '?q=concept.causeOfDeath&v=custom:value')
        .then(response => {

          var all = response.data.results.map(r => $http.get(Bahmni.Common.Constants.conceptUrl + '/' + r.value));

          return $q.all(all).then(results => _.flatMap(results, r => r.data !== null ? filterRetireDeathConcepts(r.data.answers) : []));
        }).catch(error => {
          $log.error('XHR Failed for getDeathConcepts. ' + error.data.error.message);
          return $q.reject(error);
        });
    }

    function searchBySource(term, source) {

      var options = {
        params: {
          source: source,
          q: term,
          v: "custom:(uuid,name,display,mappings:(conceptReferenceTerm:(conceptSource:(uuid))))"
        },
        ignoreLoadingBar: true // Ignored because searchBySource field already has an indicator.
      };

      return $http.get(Bahmni.Common.Constants.conceptUrl, options)
        .then(response => response.data.results.filter(c => {
          var sameSource = c.mappings.filter(m => m.conceptReferenceTerm.conceptSource.uuid === source);
          return sameSource.length !== 0;
        }))
        .catch(error => {
          $log.error('XHR Failed for searchBySource: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

  }

})();
