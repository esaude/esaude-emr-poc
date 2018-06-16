'use strict';

describe('dashboard', function () {
  var scope, $rootScope, $q, $componentController, controller, patientService, visitService, authorizationService,
    $state,
    alertService, patient;

  var FLAGS = ['TB', 'Low Hemoglobin'];

  var visit1 = {patient: {uuid: "3951a5f8-cdce-4421-bfe3-cfdd701168d0"}};
  var getTodaysVisitParams = {
    "3951a5f8-cdce-4421-bfe3-cfdd701168d0": visit1
  };

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

  beforeEach(inject(function (_$componentController_, _$rootScope_, _patientService_, _$q_, _$state_, _visitService_,
                              _authorizationService_, _alertService_) {
    scope = _$rootScope_.$new();
    $rootScope = _$rootScope_;
    $componentController = _$componentController_;
    patientService = _patientService_;
    $q = _$q_;
    visitService = _visitService_;
    authorizationService = _authorizationService_;
    $state = _$state_;
    alertService = _alertService_;

    patient = {uuid: "UUID_1"};
    spyOn(patientService, 'getPatient').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(patient);
      });
    });

    spyOn(alertService, 'get').and.callFake(function () {
      return $q(function (resolve) {
        return resolve({data: {flags: FLAGS}});
      });
    });

    spyOn(visitService, 'getTodaysVisit').and.callFake(function (patientUuid) {
      return $q(function (resolve) {
        return resolve(getTodaysVisitParams[patientUuid]);
      });
    });

  }));

  describe('$onInit', function () {

    it('should retrieve necessary data', function () {

      spyOn(authorizationService, 'hasPrivilege').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(true);
        });
      });

      controller = $componentController('dashboard', null, {patient: patient});

      controller.$onInit();

      $rootScope.$apply();

      expect(controller.patient).toEqual(patient);
      expect(controller.flags).toEqual(FLAGS);
      expect(controller.patient).toEqual(patient);
      expect(controller.hasLabOrderPrivilege).toEqual(true);
    });

    it('should mark accordingly when no privilege', function () {

      spyOn(authorizationService, 'hasPrivilege').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(false);
        });
      });

      controller = $componentController('dashboard', null, {patient: {uuid: 'OTHER_UUID'}});

      controller.$onInit();

      $rootScope.$apply();

      expect(controller.hasLabOrderPrivilege).toEqual(false);
    });

    it('should load last visit', function () {

      spyOn(authorizationService, 'hasPrivilege').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(true);
        });
      });

      controller = $componentController('dashboard', null, {patient: {uuid: "3951a5f8-cdce-4421-bfe3-cfdd701168d0"}});

      controller.$onInit();

      $rootScope.$apply();

      expect(controller.hasVisitToday).toEqual(true);
      expect(controller.todayVisit).toEqual(visit1);
    });

    it('should not load last visit', function () {
      spyOn(authorizationService, 'hasPrivilege').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(true);
        });
      });

      controller = $componentController('dashboard', null, {patient: {uuid: 'OUTRO_UUID'}});

      controller.$onInit();

      $rootScope.$apply();

      expect(controller.hasVisitToday).toEqual(false);
    });

  });

  describe('reload', function () {

    it('should reload current state', function () {

      spyOn($state, 'reload');

      var ctrl = $componentController('dashboard');

      ctrl.reload();

      expect($state.reload).toHaveBeenCalled();

    });

  });

});
