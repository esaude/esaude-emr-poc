describe('NotesController', function () {

  var controller, $controller, $q, $rootScope, $http, scope, encounterService;

  var ENCOUNTERS = [];

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

  beforeEach(inject(function (_$controller_, _$q_, _$rootScope_, $httpBackend, _encounterService_) {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $http = $httpBackend;
    encounterService = _encounterService_;
  }));

  beforeEach(function () {
    spyOn(encounterService, 'getEncountersForEncounterType').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(ENCOUNTERS);
      });
    });

    scope = {};
  });

  beforeEach(function () {
    controller = $controller('NotesController', {
      $scope: scope
    });
    $rootScope.$apply();
  });

  describe('notes are not shown when no encounters are found', function () {
    it('notes are not shown when no encounters are found', function () {
      expect(scope.showNotes).toBeFalsy();
    });
  });

});
