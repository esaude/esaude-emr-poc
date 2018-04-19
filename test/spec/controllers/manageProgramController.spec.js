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

      var ctrl = $controller('ManageProgramController', {$scope: {}});

      expect(programService.getAllPrograms).toHaveBeenCalled();

    });

    it('should initialize data and load all programs', function () {

      var scope = {};
      var ctrl = $controller('ManageProgramController', {$scope: scope});

      $rootScope.$apply();

      expect(scope.programSelected).toEqual({});
      expect(scope.allPrograms).toEqual(PROGRAMS);
    });

  });

});
