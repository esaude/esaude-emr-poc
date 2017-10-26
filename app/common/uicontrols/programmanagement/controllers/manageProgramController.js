(function () {
  'use strict';

  angular
    .module('bahmni.common.uicontrols.programmanagment')
    .controller('ManageProgramController', ManageProgramController);

  ManageProgramController.$inject = ['$scope', '$window', 'programService', 'spinner', '$stateParams', 'notifier', '$filter'];

  /* @ngInject */
  function ManageProgramController($scope, $window, programService, spinner, $stateParams, notifier, $filter) {

    var DateUtil = Bahmni.Common.Util.DateUtil;

    $scope.programSelected = {};
    $scope.programEnrollmentDate = null;
    $scope.workflowStateSelected = {};
    $scope.allPrograms = [];
    $scope.programWorkflowStates = [];
    $scope.programEdited = {selectedState: "", startDate: null};
    $scope.workflowStatesWithoutCurrentState = [];
    $scope.outComesForProgram = [];
    $scope.configName = $stateParams.configName;

    $scope.setProgramSelected = setProgramSelected;
    $scope.hasPatientEnrolledToSomePrograms = hasPatientEnrolledToSomePrograms;
    $scope.hasPatientAnyPastPrograms = hasPatientAnyPastPrograms;
    $scope.enrollPatient = enrollPatient;
    $scope.getOutcomes = getOutcomes;
    $scope.hasOutcomes = hasOutcomes;
    $scope.getCurrentProgramState = getCurrentProgramState;
    $scope.hasValidProgramStateToShow = hasValidProgramStateToShow;
    $scope.initCurrentState = initCurrentState;
    $scope.getWorkflowStatesWithoutCurrent = getWorkflowStatesWithoutCurrent;
    $scope.savePatientProgram = savePatientProgram;
    $scope.editPatientProgram = editPatientProgram;
    $scope.toggleEdit = toggleEdit;
    $scope.toggleEnd = toggleEnd;
    $scope.setWorkflowStates = setWorkflowStates;
    $scope.canRemovePatientState = canRemovePatientState;
    $scope.removePatientState = removePatientState;
    $scope.getWorkflowStates = getWorkflowStates;
    $scope.hasStates = hasStates;
    $scope.hasProgramWorkflowStates = hasProgramWorkflowStates;
    $scope.resetProgramFields = resetProgramFields;

    activate();

    ////////////////

    function activate() {
      spinner.forPromise(programService.getAllPrograms().then(function (programs) {
        $scope.allPrograms = programs;
      }));
      updateActiveProgramsList();
    }

    function setProgramSelected(program) {
      $scope.programSelected = program;
      if ($scope.hasProgramWorkflowStates(program)) {
        $scope.workflowStatesWithoutCurrentState = $scope.getWorkflowStatesWithoutCurrent(program);
        $scope.currentState = $scope.initCurrentState(program);
      }
    }

    function hasPatientEnrolledToSomePrograms() {
      return !_.isEmpty($scope.activePrograms);
    }

    function hasPatientAnyPastPrograms() {
      return !_.isEmpty($scope.endedPrograms);
    }

    function enrollPatient(program, programEnrollmentDate, state) {
      $scope.programSelected = program;
      if (!isProgramSelected()) {
        showMessage("COMMON_PROGRAM_ENROLLMENT_ERROR_NO_PROGRAM");
        return;
      }
      if (!programEnrollmentDate) {
        showMessage("COMMON_PROGRAM_ENROLLMENT_ERROR_NO_ADMISSION_DATE");
        return;
      }
      if (isThePatientAlreadyEnrolled()) {
        showMessage("COMMON_PROGRAM_ENROLLMENT_ERROR_ALREADY_ENROLLED");
        return;
      }
      if (DateUtil.isAfterDate(programEnrollmentDate, new Date())) {
        showMessage("COMMON_PROGRAM_ENROLLMENT_DATE_NOT_IN_FUTURE");
        return;
      }
      $scope.workflowStateSelected = state;
      $scope.programEnrollmentDate = DateUtil.parse(programEnrollmentDate);


      var stateUuid = $scope.workflowStateSelected && $scope.workflowStateSelected.uuid ? $scope.workflowStateSelected.uuid : null;
      spinner.forPromise(
        programService.enrollPatientToAProgram($scope.patient.uuid, $scope.programSelected.uuid, $scope.programEnrollmentDate, stateUuid)
          .then(successCallback, failureCallback)
      );
      $scope.errorMessage = null;
    }

    function updateActiveProgramsList() {
      spinner.forPromise(programService.getPatientPrograms($stateParams.patientUuid).then(function (programs) {
        $scope.patientAllPrograms = _.union(programs.activePrograms, programs.endedPrograms);
        $scope.activePrograms = programs.activePrograms;
        $scope.endedPrograms = programs.endedPrograms;
      }));
    }

    function resetProgramFields() {
      $scope.programEdited.selectedState = null;
      $scope.programEdited.startDate = null;
      $scope.programSelected = {};
      $scope.workflowStateSelected = {};
    }

    function successCallback() {
      updateActiveProgramsList();
      getAddProgramModal().modal('toggle');
      notifier.success($filter('translate')('COMMON_MESSAGE_SUCCESS_ACTION_COMPLETED'));
    }

    function failureCallback(error) {
      var fieldErrorMsg = findFieldErrorIfAny(error);
      var globalErrorMsg = error.data.error.globalErrors[0].message;

      var msg = fieldErrorMsg || globalErrorMsg;

      if (msg) {
        showMessage(msg);
      } else {
        notifier.error($filter('translate')('COMMON_MESSAGE_ERROR_ACTION'));
      }
    }

    function findFieldErrorIfAny(error) {
      var stateFieldError = objectDeepFind(error, "data.error.fieldErrors.states");
      var errorField = stateFieldError && stateFieldError[0];
      return errorField && errorField.message;
    }

    function objectDeepFind(obj, path) {
      if (_.isUndefined(obj)) {
        return undefined;
      }
      var paths = path.split('.')
        , current = obj
        , i;
      for (i = 0; i < paths.length; ++i) {
        if (angular.isUndefined(current[paths[i]])) {
          return undefined;
        } else {
          current = current[paths[i]];
        }
      }
      return current;
    }

    function isThePatientAlreadyEnrolled() {
      return _.map($scope.activePrograms, function (program) {
        return program.program.uuid
      }).indexOf($scope.programSelected.uuid) > -1;
    }

    function isProgramSelected() {
      return $scope.programSelected && $scope.programSelected.uuid;
    }

    function isProgramStateSelected() {
      return objectDeepFind($scope, "programEdited.selectedState.uuid");
    }

    function getOutcomes(program) {
      var currentProgram = _.find($scope.allPrograms, {uuid: program.uuid});
      return currentProgram.outcomesConcept ? currentProgram.outcomesConcept.answers : [];
    }

    function hasOutcomes(program) {
      return program.outcomesConcept && !_.isEmpty(program.outcomesConcept.answers);
    }

    function isOutcomeSelected(patientProgram) {
      return !_.isEmpty(objectDeepFind(patientProgram, 'outcomeData.uuid'));
    }

    function getCurrentState(states) {
      return _.find(states, function (state) {
        return state.endDate === null && !state.voided;
      });
    }

    function getCurrentProgramState(states) {
      return getCurrentState(states);
    }

    //must have at least one state and non voided
    function hasValidProgramStateToShow(states) {
      return states.some(function (s) {
        return !s.voided;
      });
    }

    function initCurrentState(patientProgram) {
      return getCurrentState(patientProgram.states);
    }

    function getWorkflowStatesWithoutCurrent(patientProgram) {
      var currentState = getCurrentState(patientProgram.states);
      var states = getStates(patientProgram.program);
      if (currentState) {
        states = _.reject(states, function (state) {
          return state.uuid === currentState.state.uuid;
        });
      }
      return states;
    }

    function savePatientProgram(patientProgram) {
      var startDate = DateUtil.parse($scope.programEdited.startDate);
      var currentState = getCurrentState(patientProgram.states);
      var currentStateDate = currentState ? DateUtil.parse(currentState.startDate) : null;

      if (DateUtil.isBeforeDate(startDate, currentStateDate)) {
        //TODO: Confirm if is the variable format formattedCurrentStateDate is currently being used
        var formattedCurrentStateDate = DateUtil.formatDateWithoutTime(currentStateDate);
        showMessage("COMMON_PROGRAM_ENROLLMENT_ERROR_STATE_EARLIER_START");
        return;
      }
      if (!isProgramStateSelected()) {
        showMessage("COMMON_PROGRAM_ENROLLMENT_ERROR_NO_STATE_TO_CHANGE");
        return;
      }

      if (!startDate) {
        showMessage("COMMON_PROGRAM_ENROLLMENT_ERROR_NO_STATE_START_DATE");
        return;
      }
      spinner.forPromise(
        programService.savePatientProgram(patientProgram.uuid, $scope.programEdited.selectedState.uuid, startDate)
          .then(successCallback, failureCallback)
      );

      getEditProgramStateModal().modal('toggle');
      $scope.errorMessage = null;
    }

    function editPatientProgram(patientProgram) {
      var dateCompleted = DateUtil.parse(patientProgram.dateCompleted);
      var dateEnrolled = patientProgram.dateEnrolled ? DateUtil.parse(patientProgram.dateEnrolled) : null;
      var currentState = getCurrentState(patientProgram.states);
      var currentStateDate = currentState ? DateUtil.parse(currentState.startDate) : null;

      if (!dateEnrolled) {
        showMessage("COMMON_PROGRAM_ENROLLMENT_ERROR_NO_ADMISSION_DATE");
        return;
      }

      if (currentState && DateUtil.isBeforeDate(dateCompleted, currentStateDate)) {
        var formattedCurrentStateDate = DateUtil.formatDateWithoutTime(currentStateDate);
        showMessage("COMMON_PROGRAM_ENROLLMENT_ERROR_EARLIER_END");
        return;
      }

      if (dateCompleted && DateUtil.isAfterDate(dateCompleted, new Date())) {
        showMessage("COMMON_PROGRAM_COMPLETION_DATE_NOT_IN_FUTURE");
        return;
      }

      var outcomeConceptUuid = patientProgram.outcome ? patientProgram.outcome.uuid : null;
      spinner.forPromise(programService.editPatientProgram(patientProgram.uuid, dateEnrolled,
        dateCompleted, outcomeConceptUuid)
        .then(function () {
          updateActiveProgramsList();
        }));

      getEditProgramModal().modal('toggle');
      $scope.errorMessage = null;
    }

    function toggleEdit(program) {
      program.ending = false;
      program.editing = !program.editing;
    }

    function toggleEnd(program) {
      program.editing = false;
      program.ending = !program.ending;
    }

    function setWorkflowStates(program) {
      $scope.programWorkflowStates = getStates(program);
    }

    function getStates(program) {
      var states = [];
      if (program && program.allWorkflows && program.allWorkflows.length && program.allWorkflows[0].states.length) {
        states = program.allWorkflows[0].states;
      }
      return states;
    }

    function getActiveProgramStates(patientProgram) {
      return _.reject(patientProgram.states, function (st) {
        return st.voided
      });
    }

    function canRemovePatientState(state) {
      return state.endDate === null;
    }

    function removePatientState(patientProgram) {
      var currProgramState = _.find(getActiveProgramStates(patientProgram), {endDate: null});
      var currProgramStateUuid = objectDeepFind(currProgramState, 'uuid');
      spinner.forPromise(
        programService.deletePatientState(patientProgram.uuid, currProgramStateUuid)
          .then(successCallback, failureCallback)
      );
    }

    function getWorkflowStates(program) {
      $scope.programWorkflowStates = [];
      if (program && program.allWorkflows.length) {
        program.allWorkflows.forEach(function (workflow) {
          if (!workflow.retired && workflow.states.length)
            workflow.states.forEach(function (state) {
              if (!state.retired)
                $scope.programWorkflowStates.push(state);
            });
        });
      }
      return states;
    }

    function hasStates(program) {
      return program && !_.isEmpty(program.allWorkflows) && !_.isEmpty($scope.programWorkflowStates);
    }

    function hasProgramWorkflowStates(patientProgram) {
      return !_.isEmpty(getStates(patientProgram.program));
    }

    function showMessage(msg) {
      $scope.errorMessage = msg;
      $scope.showMessage = true;
      angular.element('.alert').show();
    }

    function getAddProgramModal() {
      return angular.element('#addProgramModal');
    }

    function getEditProgramModal() {
      return angular.element('#editProgramModal');
    }

    function getEditProgramStateModal() {
      return angular.element('#editProgramStateModal');
    }
  }

})();
