'use strict';

describe('DashboardController', function () {
  var patientUuid, scope, $rootScope, $q, $controller, controller, location, patientService, patientMapper,
    httpBackend, stateParams, visitService, authorizationService, $state, alertService;

  var FLAGS = ['TB', 'Low Hemoglobin'];

  beforeEach(module('clinic', function ($provide, $translateProvider, $urlRouterProvider) {
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

  beforeEach(inject(function (_$controller_, _$rootScope_, _patientService_, _$q_, _$state_, _visitService_,
                              _authorizationService_, _alertService_) {
    scope = _$rootScope_.$new();
    $rootScope = _$rootScope_;
    $controller = _$controller_;
    patientService = _patientService_;
    $q = _$q_;
    visitService = _visitService_;
    authorizationService = _authorizationService_;
    $state = _$state_;
    alertService = _alertService_;

    spyOn(patientService, 'getPatient').and.callFake(function () {
      return $q(function (resolve) {
        return resolve({});
      });
    });

    spyOn(alertService, 'get').and.callFake(function () {
      return $q(function (resolve) {
        return resolve({data:{flags:FLAGS}});
      });
    });

    spyOn(visitService, 'getTodaysVisit').and.callFake(function () {
      return $q(function (resolve) {
        return resolve({});
      });
    });

    spyOn(authorizationService, 'hasPrivilege').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(true);
      });
    });

    controller = $controller('DashboardController', {
      $scope: scope,
      $stateParams: {patientUuid: '3951a5f8-cdce-4421-bfe3-cfdd701168d0'}
    });

  }));

  describe('activate', function () {

    it('should get patient uuid', function () {
      $rootScope.$apply();
      expect(patientService.getPatient).toHaveBeenCalled();
      expect(scope.flags).toEqual(FLAGS);
    });
  });

  describe('reload', function () {

    it('should reload current state', function () {

      spyOn($state, 'reload');

      var scope = {};
      var ctrl = $controller('DashboardController', {$scope: scope});
      scope.reload();

      expect($state.reload).toHaveBeenCalled();

    });

  });

});
