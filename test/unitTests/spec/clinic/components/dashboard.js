'use strict';

describe('dashboard', () => {
  var scope, $rootScope, $q, $componentController, controller, patientService, visitService, authorizationService,
    $state,
    alertService, patient;

  var FLAGS = ['TB', 'Low Hemoglobin'];

  var visit1 = {patient: {uuid: "3951a5f8-cdce-4421-bfe3-cfdd701168d0"}};
  var getTodaysVisitParams = {
    "3951a5f8-cdce-4421-bfe3-cfdd701168d0": visit1
  };

  beforeEach(module('clinic', ($provide, $translateProvider, $urlRouterProvider) => {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', $q => () => {
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject((_$componentController_, _$rootScope_, _patientService_, _$q_, _$state_, _visitService_,
                     _authorizationService_, _alertService_) => {
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
    spyOn(patientService, 'getPatient').and.callFake(() => $q(resolve => resolve(patient)));

    spyOn(alertService, 'get').and.callFake(() => $q(resolve => resolve({data: {flags: FLAGS}})));

    spyOn(visitService, 'getTodaysVisit').and.callFake(patientUuid => $q(resolve => resolve(getTodaysVisitParams[patientUuid])));

  }));

  describe('$onInit', () => {

    it('should retrieve necessary data', () => {

      spyOn(authorizationService, 'hasPrivilege').and.callFake(() => $q(resolve => resolve(true)));

      controller = $componentController('dashboard', null, {patient: patient});

      controller.$onInit();

      $rootScope.$apply();

      expect(controller.patient).toEqual(patient);
      expect(controller.flags).toEqual(FLAGS);
      expect(controller.patient).toEqual(patient);
      expect(controller.hasLabOrderPrivilege).toEqual(true);
    });

    it('should mark accordingly when no privilege', () => {

      spyOn(authorizationService, 'hasPrivilege').and.callFake(() => $q(resolve => resolve(false)));

      controller = $componentController('dashboard', null, {patient: {uuid: 'OTHER_UUID'}});

      controller.$onInit();

      $rootScope.$apply();

      expect(controller.hasLabOrderPrivilege).toEqual(false);
    });

    it('should load last visit', () => {

      spyOn(authorizationService, 'hasPrivilege').and.callFake(() => $q(resolve => resolve(true)));

      controller = $componentController('dashboard', null, {patient: {uuid: "3951a5f8-cdce-4421-bfe3-cfdd701168d0"}});

      controller.$onInit();

      $rootScope.$apply();

      expect(controller.hasVisitToday).toEqual(true);
      expect(controller.todayVisit).toEqual(visit1);
    });

    it('should not load last visit', () => {
      spyOn(authorizationService, 'hasPrivilege').and.callFake(() => $q(resolve => resolve(true)));

      controller = $componentController('dashboard', null, {patient: {uuid: 'OUTRO_UUID'}});

      controller.$onInit();

      $rootScope.$apply();

      expect(controller.hasVisitToday).toEqual(false);
    });

  });

  describe('reload', () => {

    it('should reload current state', () => {

      spyOn($state, 'reload');

      var ctrl = $componentController('dashboard');

      ctrl.reload();

      expect($state.reload).toHaveBeenCalled();

    });

  });

});
