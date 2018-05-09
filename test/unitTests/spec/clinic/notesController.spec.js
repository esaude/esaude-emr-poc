describe('NotesController', function () {

  var controller, $controller, scope, $rootScope, encounterService, $q, stateParams;

  beforeEach(module('clinic'));

  beforeEach(module('common.test', function ($provide, $translateProvider, $urlRouterProvider) {
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

  beforeEach(inject(function (_$controller_, _$rootScope_, $httpBackend, _encounterService_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $http = $httpBackend;
    encounterService = _encounterService_;
    $q = _$q_;
  }));

  beforeEach(function () {

    scope = {};
    stateParams = { patientUuid: "UUID_1" };

    spyOn(encounterService, 'getEncountersForEncounterType').and.callFake(function () {
      return $q(function (resolve) {
        return resolve({});
      });
    });

    controller = $controller('NotesController', {
      $scope: scope,
      $stateParams : stateParams
    });
    $rootScope.$apply();

  });

  describe('activate', function () {
    it('should not show notes if none exists', function () {
      expect(scope.showNotes).toBe(false);
    });
  });

});
