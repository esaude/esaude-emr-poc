'use strict';

describe('PatientSearchController', function () {

  var $componentController, $q, $compile, $rootScope, $state, ctrl, openmrsPatientMapper, patientService;

  beforeEach(module('common.patient'));

  beforeEach(inject(function (_$componentController_, _$q_, _$compile_, _$rootScope_, _$state_, _openmrsPatientMapper_, _patientService_) {
    $componentController = _$componentController_;
    $q = _$q_;
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    openmrsPatientMapper = _openmrsPatientMapper_;
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

  describe('barcodeHandler', function () {

    var testPatient = {
      uuid: '11111111/11/11111',
    }

    beforeEach(function () {
      spyOn(patientService, 'search').and.callFake(function () {
        return {
          then: (fn) => {
            fn([testPatient])
            return {
              error: (errorFn) => errorFn(),
            }
          },
        }
      })

      spyOn(openmrsPatientMapper, 'map').and.callFake(function () {
        return testPatient
      })
      
      spyOn(ctrl, 'onPatientSelect')
    });

    it("should automatically select patient after search", function () {

      // Add the bard code listener element with auto select set to true
      const autoSelect = 'true'
      var html = `<barcode-listener data-auto-select="${autoSelect}"><barcode-listener>`;
      const element = $compile(html)($rootScope);
      angular.element(document.body).append(element);
      $rootScope.$digest();

      ctrl.barcodeHandler(testPatient.uuid);

      $rootScope.$apply();
      expect(patientService.search).toHaveBeenCalled();
      expect(openmrsPatientMapper.map).toHaveBeenCalled();
      
      expect(ctrl.onPatientSelect).toHaveBeenCalled()
    });

    it("should not automatically select patient after search", function () {

      // Add the bard code listener element with auto select set to false
      const autoSelect = 'false'
      var html = `<barcode-listener data-auto-select="${autoSelect}"><barcode-listener>`;
      const element = $compile(html)($rootScope);
      angular.element(document.body).append(element);
      $rootScope.$digest();

      ctrl.barcodeHandler(testPatient.uuid);

      $rootScope.$apply();
      expect(patientService.search).toHaveBeenCalled();
      expect(openmrsPatientMapper.map).toHaveBeenCalled();
      
      expect(ctrl.onPatientSelect).toHaveBeenCalled()
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
