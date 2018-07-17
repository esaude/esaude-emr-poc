'use strict';

describe('PatientSearchController', () => {

  var $componentController, $q, $compile, $rootScope, $state, ctrl, openmrsPatientMapper, patientService, notifier;

  beforeEach(module('barcodeListener', $provide => {

    // Prevent the real barcodeListener to be linked, otherwise it will complain about prefix not being a string.
    // This is because AngularJS creates a different scope from the one provided to this directive's linking function.
    $provide.factory('barcodeListenerDirective', () => ({
      restrict: 'EA',
      scope: {
        onScan: '=',
        prefix: '@',
        length: '@',
        scanDuration: '@?'
      },
      link: () => {
      }
    }));

  }));

  beforeEach(module('common.patient'));

  beforeEach(inject((_$componentController_, _$q_, _$compile_, _$rootScope_, _$state_, _openmrsPatientMapper_,
                     _patientService_, _notifier_) => {
    $componentController = _$componentController_;
    $q = _$q_;
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    openmrsPatientMapper = _openmrsPatientMapper_;
    patientService = _patientService_;
    $state = _$state_;
    notifier = _notifier_;
  }));

  beforeEach(() => {
    ctrl = $componentController('patientSearch');
  });

  describe('change', () => {

    var results = [];

    beforeEach(() => {
      spyOn(patientService, 'search').and.callFake(() => $q(resolve => resolve(results)));
    });

    it("should search for patients", () => {

      ctrl.searchText = 'Mal';
      ctrl.change();

      $rootScope.$apply();
      expect(patientService.search).toHaveBeenCalled();
      expect(ctrl.results).toEqual(results);

    });
  });

  describe('barcodeHandler', () => {

    var testPatient = {
      uuid: '11111111/11/11111',
    };

    beforeEach(() => {

      spyOn(openmrsPatientMapper, 'map').and.callFake(() => testPatient);

      spyOn(ctrl, 'onPatientSelect');
    });

    it("should automatically select patient after search", () => {

      spyOn(patientService, 'search').and.callFake(() => $q.resolve([testPatient]));

      // Add the bard code listener element with auto select set to true
      const autoSelect = true;
      var html = `<barcode-listener on-scan='vm.barcodeHandler' prefix='' length='17' scan-duration='500' data-auto-select='${autoSelect}'><barcode-listener>`;
      const element = $compile(html)($rootScope);
      angular.element(document.body).append(element);
      $rootScope.$digest();

      ctrl.barcodeHandler(testPatient.uuid);

      $rootScope.$apply();
      expect(patientService.search).toHaveBeenCalled();
      expect(openmrsPatientMapper.map).toHaveBeenCalled();

      expect(ctrl.onPatientSelect).toHaveBeenCalled();
    });

    it("should not automatically select patient after search", () => {

      spyOn(patientService, 'search').and.callFake(() => $q.resolve([testPatient]));

      // Add the bard code listener element with auto select set to false
      const autoSelect = false;
      var html = `<barcode-listener on-scan='vm.barcodeHandler' prefix='' length='17' scan-duration='500' data-auto-select='${autoSelect}'><barcode-listener>`;
      const element = $compile(html)($rootScope);
      angular.element(document.body).append(element);
      $rootScope.$digest();

      ctrl.barcodeHandler(testPatient.uuid);

      $rootScope.$apply();
      expect(patientService.search).toHaveBeenCalled();
      expect(openmrsPatientMapper.map).toHaveBeenCalled();

      expect(ctrl.onPatientSelect).toHaveBeenCalled();
    });

    it('should set search text to scanned barcode', () => {

      spyOn(patientService, 'search').and.callFake(() => $q.resolve([testPatient]));

      ctrl.barcodeHandler(testPatient.uuid);

      $rootScope.$apply();

      expect(ctrl.searchText).toEqual(testPatient.uuid);

    });

    it('should inform if no patients found', () => {

      spyOn(patientService, 'search').and.callFake(() => $q.resolve([]));

      spyOn(notifier, 'info');

      ctrl.barcodeHandler(testPatient.uuid);

      $rootScope.$apply();

      expect(notifier.info).toHaveBeenCalled();

    });
  });

  describe('linkDashboard', () => {

    it('should go to dashboard', () => {

      spyOn($state, 'go');

      var patient = {uuid: '6c6055c9-f6f0-4275-b803-e7452baedb2f'};
      ctrl.linkDashboard(patient);

      expect($state.go).toHaveBeenCalledWith('dashboard', {patientUuid: patient.uuid});

    });

  });

  describe('linkPatientNew', () => {

    it('should go to new patient identifiers', () => {

      spyOn($state, 'go');

      ctrl.linkPatientNew();

      expect($state.go).toHaveBeenCalledWith('newpatient');

    });

  });

});
