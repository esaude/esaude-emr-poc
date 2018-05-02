'use strict';

describe("ManageProgramController", function () {

  var $controller, $rootScope, $q, programService;

  var PROGRAMS = ["program1", "program2"];


  beforeEach(module('bahmni.common.uicontrols.programmanagment'));

  beforeEach(inject(function (_$controller_, _$rootScope_, _$q_, _programService_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    programService = _programService_;
  }));

  describe('activate', function () {

    beforeEach(function () {

      spyOn(programService, 'getAllPrograms').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(PROGRAMS);
        });
      });

      spyOn(programService, 'getPatientPrograms').and.callFake(function () {
        return $q(function (resolve) {
          return resolve([]);
        });
      });

    });

    it('should load all programs', function () {

      var ctrl = $controller('ManageProgramController', { $scope: {} });

      expect(programService.getAllPrograms).toHaveBeenCalled();

    });

    it('should initialize data and load all programs', function () {

      var scope = {};
      var ctrl = $controller('ManageProgramController', { $scope: scope });

      $rootScope.$apply();

      expect(scope.programSelected).toEqual({});
      expect(scope.allPrograms).toEqual(PROGRAMS);
    });

  });

  describe('resetProgramFields', function () {

    it('should reset selected state', function () {

      var scope = { programEdited: { programEdited: '' } };
      var ctrl = $controller('ManageProgramController', { $scope: scope });

      scope.resetProgramFields();

      expect(scope.programEdited.selectedState).toEqual(null);

    });
    it('should reset start date', function () {

      var scope = { programEdited: { startDate: new Date() } };
      var ctrl = $controller('ManageProgramController', { $scope: scope });

      scope.resetProgramFields();

      expect(scope.programEdited.startDate).toEqual(null);

    });

    it('should reset program selected', function () {

      var scope = { programSelected: { x: 'y' } };
      var ctrl = $controller('ManageProgramController', { $scope: scope });

      scope.resetProgramFields();

      expect(scope.programSelected).toEqual({});

    });

    it('should reset selected workflow state', function () {

      var scope = { workflowStateSelected: { x: 'y' } };
      var ctrl = $controller('ManageProgramController', { $scope: scope });

      scope.resetProgramFields();

      expect(scope.workflowStateSelected).toEqual({});

    });

  });

  describe('setProgramSelected', function () {
    it('should set the selected program and state', function () {
      var scope = {};
      var patientProgram = {
        program: {
          allWorkflows: [
            {
              states: [
                { endDate: null, uuid: 'UUID4' },
                { endDate: moment('2017-10-16').toDate(), uuid: 'UUID3' }]
            }]
        }
      };
      var ctrl = $controller('ManageProgramController', { $scope: scope });
      scope.setProgramSelected(patientProgram);
      expect(scope.programSelected).toEqual(patientProgram);
      expect(scope.getCurrentProgramState(patientProgram.program.allWorkflows[0].states).uuid).toEqual('UUID4');
    });

    it('should not allow completion date for arv treatment', function () {
      var ARV_TREATMENT_PROGRAM_UUID = 'efe2481f-9e75-4515-8d5a-86bfde2b5ad3';
      var scope = {};
      var patientProgram = {
        program: {
          uuid: ARV_TREATMENT_PROGRAM_UUID
        }
      };
      var ctrl = $controller('ManageProgramController', { $scope: scope });
      scope.setProgramSelected(patientProgram);
      expect(scope.allowCompletionDate).toBe(false);
    });

    it('should allow completion date for any other program besides arv treatment', function () {
      var scope = {};
      var patientProgram = {
        program: {
          uuid: "RANDOM_UUID"
        }
      };
      var ctrl = $controller('ManageProgramController', { $scope: scope });
      scope.setProgramSelected(patientProgram);
      expect(scope.allowCompletionDate).toBe(true);
    });
  });

  describe('hasPatientEnrolledToSomePrograms', function () {
    it('should be false when programs list is empty', function () {
      var scope = { activePrograms: [] };
      var ctrl = $controller('ManageProgramController', { $scope: scope });
      expect(scope.hasPatientEnrolledToSomePrograms()).toBeFalsy();
    });

    it('should be true when programs list is not empty', function () {
      var scope = { activePrograms: ["PRG1"] };
      var ctrl = $controller('ManageProgramController', { $scope: scope });
      expect(scope.hasPatientEnrolledToSomePrograms()).toBeTruthy();
    });
  });

  describe('hasPatientAnyPastPrograms', function () {
    it('should be true when ended programs list is not empty', function () {
      var scope = { endedPrograms: ["PRG1"] };
      var ctrl = $controller('ManageProgramController', { $scope: scope });
      expect(scope.hasPatientAnyPastPrograms()).toBeTruthy();
    });
  });
});
