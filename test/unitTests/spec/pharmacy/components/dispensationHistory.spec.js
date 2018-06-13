'use strict';

describe('dispensationHistory', function () {

  var $componentController, $rootScope, controller, encounterService, $q;

  beforeEach(module('pharmacy', function ($provide, $translateProvider, $urlRouterProvider) {
    // Mock initialization
    $provide.factory('initialization', function () {
    });
    // Mock appService
    var appService = jasmine.createSpyObj('appService', ['initApp']);
    appService.initApp.and.returnValue({
      then: function (fn) {
      }
    });
    $provide.value('appService', appService);
    // Mock translate asynchronous loader
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

  beforeEach(inject(function (_$componentController_, _$rootScope_, _encounterService_, _$q_) {
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    encounterService = _encounterService_;
    $q = _$q_;
  }));

  describe('$onInit', function () {

    beforeEach(function () {

      spyOn(encounterService, 'getEncountersForEncounterType').and.callFake(function () {
        return $q(function (resolve) {
          resolve([]);
        });
      });

      controller = $componentController('dispensationHistory', null, { patient: { uuid: 'UUID_1' } });
    });

    it('should load patient prescriptions', function () {
      controller.$onInit();
      $rootScope.$apply();
      expect(controller.filaObsList.nextPickup).toEqual("e1e2efd8-1d5f-11e0-b929-000c29ad1d07");
      expect(controller.filaObsList.quantity).toEqual("e1de2ca0-1d5f-11e0-b929-000c29ad1d07");
    });

  });

});
