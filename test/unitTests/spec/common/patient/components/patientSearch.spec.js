'use strict';

describe('PatientSearchController', function () {

  var $componentController, $q, $compile, $rootScope, $state, ctrl, openmrsPatientMapper, patientService, notifier;

  beforeEach(module('barcodeListener', function ($provide) {

    // Prevent the real barcodeListener to be linked, otherwise it will complain about prefix not being a string.
    // This is because AngularJS creates a different scope from the one provided to this directive's linking function.
    $provide.factory('barcodeListenerDirective', function () {
      return {
        restrict: 'EA',
        scope: {
          onScan: '=',
          prefix: '@',
          length: '@',
          scanDuration: '@?'
        },
        link: function() {
        }
      };
    });

  }));

  beforeEach(module('common.patient'));

  beforeEach(inject(function (_$componentController_, _$q_, _$compile_, _$rootScope_, _$state_, _openmrsPatientMapper_,
                              _patientService_, _notifier_) {
    $componentController = _$componentController_;
    $q = _$q_;
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    openmrsPatientMapper = _openmrsPatientMapper_;
    patientService = _patientService_;
    $state = _$state_;
    notifier = _notifier_;
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
        });
      });
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
    };

    beforeEach(function () {

      spyOn(openmrsPatientMapper, 'map').and.callFake(function () {
        return testPatient;
      });

      spyOn(ctrl, 'onPatientSelect');
    });

    it("should automatically select patient after search", function () {

      spyOn(patientService, 'search').and.callFake(function () {
        return $q.resolve([testPatient]);
      });

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

    it("should not automatically select patient after search", function () {

      spyOn(patientService, 'search').and.callFake(function () {
        return $q.resolve([testPatient]);
      });

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

    it('should set search text to scanned barcode', function () {

      spyOn(patientService, 'search').and.callFake(function () {
        return $q.resolve([testPatient]);
      });

      ctrl.barcodeHandler(testPatient.uuid);

      $rootScope.$apply();

      expect(ctrl.searchText).toEqual(testPatient.uuid);

    });

    it('should inform if no patients found', function () {

      spyOn(patientService, 'search').and.callFake(function () {
        return $q.resolve([]);
      });

      spyOn(notifier, 'info');

      ctrl.barcodeHandler(testPatient.uuid);

      $rootScope.$apply();

      expect(notifier.info).toHaveBeenCalled();

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
