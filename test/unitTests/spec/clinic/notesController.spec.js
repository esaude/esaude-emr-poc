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
  });

  describe('activate', function () {
    it('should not show notes if none exists', function () {
      spyOn(encounterService, 'getEncountersForEncounterType').and.callFake(function () {
        return $q(function (resolve) {
          return resolve([]);
        });
      });
      controller = $controller('NotesController', { $scope: scope, $stateParams: stateParams });
      $rootScope.$apply();
      expect(scope.showNotes).toBe(false);
    });

    it('should show notes', function () {
      var obs1 = { concept: { uuid: Bahmni.Common.Constants.typeOfMessageConceptUuid }, value: { uuid: "feb94661-9f27-4a63-972f-39ebb63c7022" } };
      var obs2 = { concept: { uuid: Bahmni.Common.Constants.typeOfMessageConceptUuid }, value: { uuid: "9b9c21dc-e1fb-4cd9-a947-186e921fa78c" } };
      var obs3 = { concept: { uuid: Bahmni.Common.Constants.observationStoryConceptuuid } };
      var encounter1 = { encounterDatetime: moment('2018-05-17').toDate(), obs: [obs1, obs3] }
      var encounter2 = { encounterDatetime: moment('2018-05-18').toDate(), obs: [obs2, obs3] }
      var encounters = [encounter1, encounter2];
      spyOn(encounterService, 'getEncountersForEncounterType').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(encounters);
        });
      });
      controller = $controller('NotesController', { $scope: scope, $stateParams: stateParams });
      $rootScope.$apply();
      expect(scope.allNotes).toEqual(encounters);
      expect(scope.lastNotes).toEqual(encounter2);
      expect(scope.lastNotesMessageType).toEqual(obs2);
      expect(scope.messageTypeMapping).toEqual("error");
    });
  });

});
