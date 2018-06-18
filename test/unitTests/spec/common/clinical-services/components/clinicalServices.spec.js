'use strict';
describe('ClinicalServiceDirectiveController', () => {

  var $componentController, $q, $rootScope, controller, visitService, patientService, visit;

  beforeEach(module('poc.common.clinicalservices'));

  beforeEach(inject((_$componentController_, _$q_, _$rootScope_, _visitService_, _patientService_) => {
    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    visitService = _visitService_;
    patientService = _patientService_;
  }));

  beforeEach(() => {
    controller = $componentController('clinicalServices');
  });

  beforeEach(() => {
    spyOn(visitService, 'getTodaysVisit').and.callFake(() => $q(resolve => resolve(visit)));
    spyOn(patientService, 'getPatient').and.callFake(() => $q(resolve => resolve({})));
  });

  describe('checkActionConstraints', () => {

    beforeEach(() => {
      visit = {};
      controller.$onInit();
    });

    describe('requireCheckIn', () => {

      it('should return whether the patient is checked-in', () => {
        var service = {actionConstraints: {requireCheckIn: true}};
        $rootScope.$apply();
        expect(controller.checkActionConstraints(service)).toEqual(true);
      });

    });

    describe('no constraints', () => {

      it('should return true', () => {
        var service = {actionConstraints: {}};
        $rootScope.$apply();
        expect(controller.checkActionConstraints(service)).toEqual(true);
      });
    });
  });

});
