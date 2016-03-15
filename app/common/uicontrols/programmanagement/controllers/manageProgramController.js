angular.module('bahmni.common.uicontrols.programmanagment')
    .controller('ManageProgramController', ['$scope', '$window', 'programService', 'spinner', '$stateParams', 'messagingService',
        function ($scope, $window, programService, spinner, $stateParams, messagingService) {
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

            var updateActiveProgramsList = function () {
                spinner.forPromise(programService.getPatientPrograms($stateParams.patientUuid).then(function (programs) {
                    $scope.patientAllPrograms = _.union(programs.activePrograms, programs.endedPrograms);
                    $scope.activePrograms = programs.activePrograms;
                    $scope.endedPrograms = programs.endedPrograms;
                    $scope.notReopenedPrograms = filterReopenedPrograms($scope.activePrograms, $scope.endedPrograms);
                    $scope.filteredActivePrograms = filterUniqueProgram($scope.activePrograms);
                    $scope.filteredNotReopenedPrograms = filterUniqueProgram($scope.notReopenedPrograms);
                }));
            };
            
            var filterReopenedPrograms = function (activePrograms, endedPrograms) {
                var diff = _.intersection(_.pluck(activePrograms, "program.uuid"), _.pluck(endedPrograms, "program.uuid"));
                return _.filter(endedPrograms, function(endedProgram) {
                    return !_.includes(diff, endedProgram.program.uuid);
                });
            };
            
            var filterUniqueProgram = function (programs) {
                return _.uniq(programs, function(n) {
                  return n.program.uuid;
                });
            }

            var init = function () {
                spinner.forPromise(programService.getAllPrograms().then(function(programs) {
                    $scope.allPrograms = programs;
                }));
                updateActiveProgramsList();
            };

            var successCallback = function (data) {
                $scope.programEdited.selectedState = null;
                $scope.programSelected = null;
                $scope.workflowStateSelected = null;
                updateActiveProgramsList();
            };

            var failureCallback = function (error) {
                var fieldErrorMsg = findFieldErrorIfAny(error);
                var errorMsg = _.isUndefined(fieldErrorMsg) ? "Failed to Save" : fieldErrorMsg;
                showMessage(errorMsg);
            };

            var findFieldErrorIfAny = function (error) {
                var stateFieldError = objectDeepFind(error, "data.error.fieldErrors.states");
                var errorField = stateFieldError && stateFieldError[0];
                return errorField && errorField.message;
            };

            var objectDeepFind = function(obj, path) {
                if(_.isUndefined(obj)){
                    return undefined;
                }
                var paths = path.split('.')
                    , current = obj
                    , i;
                for (i = 0; i < paths.length; ++i) {
                    if (current[paths[i]] == undefined) {
                        return undefined;
                    } else {
                        current = current[paths[i]];
                    }
                }
                return current;
            };

            var isThePatientAlreadyEnrolled = function () {
                return _.pluck($scope.activePrograms, function (program) {
                        return program.program.uuid
                    }).indexOf($scope.programSelected.uuid) > -1;
            };

            var isProgramSelected = function () {
                return $scope.programSelected && $scope.programSelected.uuid;
            };
            
            $scope.setProgramSelected = function (program) {
                $scope.programSelected = program;
                if ($scope.hasProgramWorkflowStates(program)) {
                    $scope.workflowStatesWithoutCurrentState = $scope.getWorkflowStatesWithoutCurrent(program);
                    $scope.currentState = $scope.initCurrentState(program);
                }
            };

            $scope.hasPatientEnrolledToSomePrograms = function () {
                return !_.isEmpty($scope.activePrograms);
            };

            $scope.hasPatientAnyPastPrograms = function () {
                return !_.isEmpty($scope.endedPrograms);
            };

            $scope.enrollPatient = function (program, programEnrollmentDate, state) {
                $scope.programSelected = null;
                $scope.programSelected = program;
                if (!isProgramSelected()) {
                    showMessage("Please select a Program to Enroll the patient");
                    return;
                }
                if(!programEnrollmentDate) {
                    showMessage("Please select an admission date");
                    return;
                }
                if (isThePatientAlreadyEnrolled()) {
                    showMessage("Patient already enrolled to the Program");
                    return;
                }
                $scope.workflowStateSelected = null;
                $scope.workflowStateSelected = state;
                $scope.programEnrollmentDate = null;
                $scope.programEnrollmentDate = DateUtil.parse(programEnrollmentDate);
                
                
                var stateUuid = $scope.workflowStateSelected && $scope.workflowStateSelected.uuid ? $scope.workflowStateSelected.uuid : null;
                spinner.forPromise(
                    programService.enrollPatientToAProgram($scope.patient.uuid, $scope.programSelected.uuid, $scope.programEnrollmentDate, stateUuid)
                        .then(successCallback, failureCallback)
                );
        
                $(function () {
                    $('#addProgramModal').modal('toggle');
                });
                $scope.errorMessage = null;
            };

            var isProgramStateSelected = function () {
                return objectDeepFind($scope, "programEdited.selectedState.uuid");
            };

            var isOutcomeSelected = function (patientProgram) {
                return !_.isEmpty(objectDeepFind(patientProgram, 'outcomeData.uuid'));
            };

            var getCurrentState = function(states){
                return _.find(states, function(state){
                    return state.endDate == null && !state.voided;
                });
            };
            
            $scope.getCurrentProgramState = function(states){
                return getCurrentState(states);
            };
            
            //must have at least one state and non voided
            $scope.hasValidProgramStateToShow = function (states) {
                for(var i in states) {
                    if(!states[i].voided) {
                        return true;
                    }
                }
                return false;
            };
            
            $scope.initCurrentState = function(patientProgram){
                return getCurrentState(patientProgram.states);
            };

            $scope.getWorkflowStatesWithoutCurrent = function (patientProgram) {
                var currentState = getCurrentState(patientProgram.states);
                var states = getStates(patientProgram.program);
                if (currentState) {
                    states = _.reject(states, function (state) {
                        return state.uuid === currentState.state.uuid;
                    });
                }
                return states;
            };

            $scope.savePatientProgram = function (patientProgram) {
                var startDate = DateUtil.parse($scope.programEdited.startDate);
                var currentState = getCurrentState(patientProgram.states);
                var currentStateDate = currentState ? DateUtil.parse(currentState.startDate) : null;
                
                if (DateUtil.isBeforeDate(startDate, currentStateDate)) {
                    var formattedCurrentStateDate = DateUtil.formatDateWithoutTime(currentStateDate);
                    showMessage("State cannot be started earlier than current state (" + formattedCurrentStateDate + ")");
                    return;
                }     
                if (!isProgramStateSelected()) {
                    showMessage("Please select a state to change.");
                    return;
                }
                
                if(!startDate) {
                    showMessage("Please select the state start date");
                    return; 
                }
                
                spinner.forPromise(
                    programService.savePatientProgram(patientProgram.uuid, $scope.programEdited.selectedState.uuid, startDate)
                        .then(successCallback, failureCallback)
                );
        
                $(function () {
                    $('#editProgramModal').modal('toggle');
                });
                $scope.errorMessage = null;
            };

            $scope.getOutcomes = function (program) {
                var currentProgram = _.findWhere($scope.allPrograms, {uuid: program.uuid});
                return currentProgram.outcomesConcept ? currentProgram.outcomesConcept.setMembers : [];
            };

            $scope.editPatientProgram = function (patientProgram) {
                var dateCompleted = DateUtil.parse(patientProgram.dateCompleted);
                var dateEnrolled = patientProgram.dateEnrolled ? DateUtil.parse(patientProgram.dateEnrolled) : null;
                var currentState = getCurrentState(patientProgram.states);
                var currentStateDate = currentState ? DateUtil.parse(currentState.startDate) : null;
                
                if(!dateEnrolled) {
                    showMessage("Please select an admission date");
                    return;
                }

                if (currentState && DateUtil.isBeforeDate(dateCompleted, currentStateDate)) {
                    var formattedCurrentStateDate = DateUtil.formatDateWithoutTime(currentStateDate);
                    showMessage("Program cannot be ended earlier than current state (" + formattedCurrentStateDate + ")");
                    return;
                }

//                if (!isOutcomeSelected(patientProgram)) {
//                    return;
//                }

                var outcomeConceptUuid = patientProgram.outcomeData ? patientProgram.outcomeData.uuid : null;
                spinner.forPromise(programService.editPatientProgram(patientProgram.uuid, dateEnrolled, 
                                    dateCompleted, outcomeConceptUuid)
                    .then(function () {
                        updateActiveProgramsList();
                    }));
                
                $(function () {
                    $('#editProgramModal').modal('toggle');
                });
                $scope.errorMessage = null;
            };

            $scope.toggleEdit = function (program) {
                program.ending = false;
                program.editing = !program.editing;
            };

            $scope.toggleEnd = function (program) {
                program.editing = false;
                program.ending = !program.ending;
            };

            $scope.setWorkflowStates = function (program) {
                $scope.programWorkflowStates = getStates(program);
            };

            var getStates = function (program) {
                var states = [];
                if (program && program.allWorkflows && program.allWorkflows.length && program.allWorkflows[0].states.length) {
                    states = program.allWorkflows[0].states;
                }
                return states;
            };
            var getActiveProgramStates = function(patientProgram){
                return _.reject(patientProgram.states, function(st) {return st.voided});
            };

            $scope.canRemovePatientState = function(state){
                return state.endDate == null;
            };

            $scope.removePatientState = function(patientProgram){
                var currProgramState = _.find(getActiveProgramStates(patientProgram), {endDate: null});
                var currProgramStateUuid = objectDeepFind(currProgramState, 'uuid');
                spinner.forPromise(
                    programService.deletePatientState(patientProgram.uuid, currProgramStateUuid)
                        .then(successCallback, failureCallback)
                );
            };

            $scope.getWorkflowStates = function(program){
                $scope.programWorkflowStates = [];
                if(program && program.allWorkflows.length ) {
                    program.allWorkflows.forEach(function(workflow){
                        if(!workflow.retired && workflow.states.length)
                            workflow.states.forEach(function(state){
                                if(!state.retired)
                                    $scope.programWorkflowStates.push(state);
                            });
                    });
                }
                return states;
            };
            $scope.hasStates = function (program) {
                return program && !_.isEmpty(program.allWorkflows) && !_.isEmpty($scope.programWorkflowStates);
            };

            $scope.hasProgramWorkflowStates = function (patientProgram) {
                return !_.isEmpty(getStates(patientProgram.program));
            };

            $scope.hasOutcomes = function (program) {
                return program.outcomesConcept && !_.isEmpty(program.outcomesConcept.setMembers);
            };
            
            var showMessage = function (msg) {
                $scope.errorMessage = msg; 
                $(function () {
                    $('.alert').show();
                });
            };
            
            init();
        }
    ]);