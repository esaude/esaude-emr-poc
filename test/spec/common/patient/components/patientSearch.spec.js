'use strict';

describe('PatientSearchController', function () {

  var $componentController, $q, $rootScope, $state, ctrl, patientService;

  beforeEach(module('common.patient'));

  beforeEach(inject(function (_$componentController_, _$q_, _$rootScope_, _$state_, _patientService_) {
    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    patientService = _patientService_;
    $state = _$state_;
  }));

  beforeEach(function () {
    ctrl = $componentController('patientSearch');
  });

  describe('change', function () {

    var results = [];

    beforeEach(function () {
      spyOn(patientService, 'search').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(results);
        })
      })
    });

    it("should search for patients", function () {

      ctrl.searchText = 'Mal';
      ctrl.change();

      $rootScope.$apply();
      expect(patientService.search).toHaveBeenCalled();
      expect(ctrl.results).toEqual(results);

    });
  });

  describe('linkDashboard', function () {

    it('should go to dashboard', function () {

      spyOn($state, 'go');

      var patient = {uuid: '6c6055c9-f6f0-4275-b803-e7452baedb2f'};
      ctrl.linkDashboard(patient);

      expect($state.go).toHaveBeenCalledWith('dashboard', {patientUuid: patient.uuid});

    });

  });

  describe('linkPatientNew', function () {

    it('should go to new patient identifiers', function () {

      spyOn($state, 'go');

      ctrl.linkPatientNew();

      expect($state.go).toHaveBeenCalledWith('newpatient.identifier');

    });

  });

});
