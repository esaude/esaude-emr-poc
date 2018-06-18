(() => {
  'use strict';

  angular
    .module('bahmni.common.domain')
    .factory('programService', programService);

  programService.$inject = ['$http', '$log', '$q'];

  /* @ngInject */
  function programService($http, $log, $q) {
    var service = {
      getAllPrograms: getAllPrograms,
      enrollPatientToAProgram: enrollPatientToAProgram,
      getPatientPrograms: getPatientPrograms,
      editPatientProgram: editPatientProgram,
      savePatientProgram: savePatientProgram,
      deletePatientState: deletePatientState
    };
    return service;

    ////////////////

    function getAllPrograms() {
      return $http.get(Bahmni.Common.Constants.programUrl, {params: {v: 'default'}}).then(data => {
        var allPrograms = filterRetiredPrograms(data.data.results);
        _.forEach(allPrograms, program => {
          program.allWorkflows = filterRetiredWorkflowsAndStates(program.allWorkflows);
          if (program.outcomesConcept) {
            program.outcomesConcept.answers = filterRetiredOutcomes(program.outcomesConcept.answers);
          }
        });
        return allPrograms;
      });
    }

    function enrollPatientToAProgram(patientUuid, programUuid, dateEnrolled, stateUuid) {
      var req = {
        url: Bahmni.Common.Constants.programEnrollPatientUrl,
        content: {
          patient: patientUuid,
          program: programUuid,
          dateEnrolled: dateEnrolled
        }
      };
      if(!_.isEmpty(stateUuid)){
        req.content.states = [
          {
            state:stateUuid,
            startDate:dateEnrolled
          }
        ];
      }
      return $http.post(req.url, req.content).then(response => response).catch(error => {
        $log.error('XHR Failed for enrollPatientToAProgram: ' + error.data.error.message);
        return $q.reject(error);
      });
    }

    function getPatientPrograms (patientUuid) {
      var req = {
        url: Bahmni.Common.Constants.programEnrollPatientUrl,
        params: {
          v: Bahmni.Common.Constants.programEnrollmentFullInformation,
          patient: patientUuid
        }
      };
      return $http.get(req.url, {params: req.params}).then(data => groupPrograms(data.data.results));
    }

    function groupPrograms (patientPrograms) {
      var activePrograms = [];
      var endedPrograms = [];
      var groupedPrograms = {};
      if (patientPrograms) {
        var filteredPrograms = filterRetiredPrograms(patientPrograms);
        _.forEach(filteredPrograms, program => {
          program.dateEnrolled = Bahmni.Common.Util.DateUtil.parseServerDateToDate(program.dateEnrolled);
          program.program.allWorkflows = filterRetiredWorkflowsAndStates(program.program.allWorkflows);
          if (program.dateCompleted) {
            endedPrograms.push(program);
          } else {
            activePrograms.push(program);
          }
        });
        groupedPrograms.activePrograms =  _.sortBy(activePrograms, program => moment(program.dateEnrolled).toDate()).reverse();
        groupedPrograms.endedPrograms = _.sortBy(endedPrograms, program => moment(program.dateCompleted).toDate()).reverse();
      }
      return groupedPrograms;
    }

    function filterRetiredPrograms (programs) {
      return _.filter(programs, program => !program.retired);
    }

    function filterRetiredWorkflowsAndStates (workflows) {
      var allWorkflows = _.filter(workflows, workflow => !workflow.retired);
      _.forEach(allWorkflows, workflow => {
        workflow.states = _.filter(workflow.states, state => !state.retired);
      });
      return allWorkflows;
    }

    function filterRetiredOutcomes (outcomes) {
      return _.filter(outcomes, outcome => !outcome.retired);
    }

    function constructStatesPayload (stateUuid, onDate, currProgramStateUuid){
      var states =[];
      if (stateUuid) {
        states.push({
            state: {
              uuid: stateUuid
            },
            uuid: currProgramStateUuid,
            startDate: onDate
          }
        );
      }
      return states;
    }

    function savePatientProgram (patientProgramUuid, stateUuid, onDate, currProgramStateUuid) {
      var req = {
        url: Bahmni.Common.Constants.programEnrollPatientUrl + "/" + patientProgramUuid,
        content: {
          states: constructStatesPayload(stateUuid, onDate, currProgramStateUuid)
        },
        headers: {"Content-Type": "application/json"}
      };
      return $http.post(req.url, req.content, req.headers);
    }

    function  editPatientProgram (patientProgramUuid, dateEnrolled, dateCompleted, outcomeUuid){
      var req = {
        url: Bahmni.Common.Constants.programEnrollPatientUrl + "/" + patientProgramUuid,
        content: {
          dateEnrolled: dateEnrolled,
          dateCompleted: dateCompleted,
          outcome: outcomeUuid
        },
        headers: {"Content-Type": "application/json"}
      };
      return $http.post(req.url, req.content, req.headers);
    }

    function deletePatientState (patientProgramUuid, patientStateUuid) {
      var req = {
        url: Bahmni.Common.Constants.programEnrollPatientUrl + "/" + patientProgramUuid + "/state/" + patientStateUuid,
        content: {
          "!purge": "",
          "reason": "User deleted the state."
        },
        headers: {"Content-Type": "application/json"}
      };
      return $http.delete(req.url, req.content, req.headers);
    }

  }

})();
