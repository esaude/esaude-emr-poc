(function () {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('visitService', visitService);

  visitService.$inject = ['$http', '$log', '$q', 'commonService', 'encounterService'];

  /* @ngInject */
  function visitService($http, $log, $q, commonService, encounterService) {
    var service = {
      activeVisits: activeVisits,
      create: create,
      getTodaysVisit: getTodaysVisit,
      getVisit: getVisit,
      getVisitHistoryForPatient: getVisitHistoryForPatient,
      search: search
    };
    return service;

    ////////////////

    function activeVisits(visits) {
      return _.filter(visits, function (visit) {
        return visit.stopDatetime === null;
      });
    }

    function create(visit) {
      return $http.post(Bahmni.Common.Constants.visitUrl, visit, {
        withCredentials: true,
        headers: {"Accept": "application/json", "Content-Type": "application/json"}
      }).then(function (response) {
        return response.data;
      }).catch(function (error) {
        $log.error('XHR Failed for create. ' + error.data);
        return $q.reject(error);
      });
    }

    function getTodaysVisit(patientUUID) {
      var dateUtil = Bahmni.Common.Util.DateUtil;

      return search({patient: patientUUID, v: "full"}).then(function (visits) {

          var nonRetired = commonService.filterRetired(visits);

          if (!_.isEmpty(nonRetired)) {

            var lastVisit = _.maxBy(nonRetired, 'startDatetime');

            var now = dateUtil.now();
            var startDatetime = dateUtil.parseDatetime(lastVisit.startDatetime);
            var stopDatetime = dateUtil.parseDatetime(lastVisit.stopDatetime);

            if (startDatetime <= now && stopDatetime >= now) {
              return lastVisit;
            }
          }

          return null;
        })
        .catch(function (error) {
          $log.error('XHR Failed for getTodaysVisit. ' + error.data);
          return $q.reject(error);
        });
    }

    function getVisit(uuid, params) {
      var parameters = params ? params : "custom:(uuid,visitId,visitType,patient,encounters:(uuid,encounterType,voided,orders:(uuid,orderType,voided,concept:(uuid,set,name),),obs:(uuid,value,concept,obsDatetime,groupMembers:(uuid,concept:(uuid,name),obsDatetime,value:(uuid,name),groupMembers:(uuid,concept:(uuid,name),value:(uuid,name),groupMembers:(uuid,concept:(uuid,name),value:(uuid,name)))))))";
      return $http.get(Bahmni.Common.Constants.visitUrl + '/' + uuid,
        {
          params: {
            v: parameters
          }
        }
      );
    }

    function search(params) {
      return $http.get(Bahmni.Common.Constants.visitUrl, {
        params: params,
        withCredentials: true
      })
        .then(function (response) {
          return response.data.results;
        })
        .catch(function (error) {
          $log.error('XHR Failed for search. ' + error.data);
          return $q.reject(error);
        });
    }

    function getVisitHistoryForPatient(patient) {
      return encounterService.getEncountersOfPatient(patient.uuid).then(function (response) {
        return commonService.filterGroupReverse(response.data);
      });
    }
  }

})();

