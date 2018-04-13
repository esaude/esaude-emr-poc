'use strict';
describe('ClinicalServiceDirectiveController', function () {

  var $componentController, $q, $rootScope, controller, visitService, patientService, visit;

  beforeEach(module('poc.common.clinicalservices'));

  beforeEach(inject(function (_$componentController_, _$q_, _$rootScope_, _visitService_, _patientService_) {
    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    visitService = _visitService_;
    patientService = _patientService_;
  }));

  beforeEach(function () {
    controller = $componentController('clinicalServices');
  });

  beforeEach(function () {
    spyOn(visitService, 'getTodaysVisit').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(visit);
      });
    });
    spyOn(patientService, 'getPatient').and.callFake(function () {
      return $q(function (resolve) {
        return resolve({});
      });
    });
  });

  describe('checkActionConstraints', function () {

    beforeEach(function () {
      visit = {};
      controller.$onInit();
    });

    describe('requireCheckIn', function () {

      it('should return whether the patient is checked-in', function () {
        var service = {actionConstraints: {requireCheckIn: true}};
        $rootScope.$apply();
        expect(controller.checkActionConstraints(service)).toEqual(true);
      });

    });

    describe('no constraints', function () {

      it('should return true', function () {
        var service = {actionConstraints: {}};
        $rootScope.$apply();
        expect(controller.checkActionConstraints(service)).toEqual(true);
      });
    });
  });

});
