'use strict';

describe('PatientSearchController', function () {

  var $componentController, $q, $rootScope, ctrl, patientService;

  beforeEach(module('common.patient'));

  beforeEach(inject(function (_$componentController_, _$q_, _$rootScope_, _patientService_) {
    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    patientService = _patientService_;
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
});
