(function () {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('conceptService', conceptService);

  conceptService.$inject = ['$http', '$log', '$q', 'orderService'];

  function conceptService($http, $log, $q, orderService) {

    var service = {
      get: get,
      getConcept: getConcept,
      getPrescriptionConvSetConcept: getPrescriptionConvSetConcept,
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
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          $log.error('XHR Failed for getConcept: ' + error.data.error.message);
          return $q.reject(error);
        })
    }

    function getConceptByTestOrder(testOrderUuid, representation) {
      return orderService.getOrder(testOrderUuid)
        .then(function (order) {
          return getConcept(order.concept.uuid, representation);
        })
        .catch(function (error) {
          $log.error('XHR Failed for getConceptByTestOrder: ' + error.data.error.message);
          return $q.reject(error);
        })
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

    function getDeathConcepts() {

      function filterRetireDeathConcepts(deathConcepts) {
        return _.filter(deathConcepts, function (concept) {
          return !concept.retired;
        });
      }

      return $http.get(Bahmni.Common.Constants.systemSetting + '?q=concept.causeOfDeath&v=custom:value')
        .then(function (response) {

          var all = response.data.results.map(function (r) {
            return $http.get(Bahmni.Common.Constants.conceptUrl + '/' + r.value);
          });

          return $q.all(all).then(function (results) {
            return _.flatMap(results, function (r) {
              return r.data !== null ? filterRetireDeathConcepts(r.data.answers) : [];
            });
          });
        }).catch(function (error) {
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
        .then(function (response) {
          return response.data.results.filter(function (c) {
            var sameSource = c.mappings.filter(function (m) {
              return m.conceptReferenceTerm.conceptSource.uuid === source;
            });
            return sameSource.length !== 0;
          });
        })
        .catch(function (error) {
          $log.error('XHR Failed for searchBySource: ' + error.data.error.message);
          return $q.reject(error);
        });
    }

  }

})();
