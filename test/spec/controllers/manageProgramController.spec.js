'use strict';

describe("ManageProgramController", function () {

  var controller, $controller, $q, $rootScope, $http, programService, scope;

  var PROGRAMS = ["program1", "program2"];

  beforeEach(module('clinic', function ($provide, $translateProvider, $urlRouterProvider) {
    $provide.factory('mergeLocaleFilesService', function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject(function (_$controller_, _$q_, _$rootScope_, $httpBackend, _programService_) {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $http = $httpBackend;
    programService = _programService_;
  }));

  beforeEach(function () {

    $http.expectGET("/openmrs/ws/rest/v1/programenrollment?v=full").respond({});
    
    spyOn(programService, 'getAllPrograms').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(PROGRAMS);
      });
    });

    scope = {};
    controller = $controller('ManageProgramController', {
      $scope: scope
    });
    $rootScope.$apply();
  });

  describe('activate', function () {
    it('should initialize data and load all programs', function () {
      expect(scope.programSelected).toEqual({});
      expect(scope.allPrograms).toEqual(PROGRAMS);
    });
  });

});
