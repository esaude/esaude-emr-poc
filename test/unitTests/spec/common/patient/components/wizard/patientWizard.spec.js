describe('patientWizard', () => {

  var $componentController, patientService, $q, $rootScope, sessionService, TabManager;

  beforeEach(module('common.patient', ($provide, $translateProvider, $urlRouterProvider) => {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', $q => () => {
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject((_$componentController_, _patientService_, _$q_, _$rootScope_, _sessionService_) => {
    $componentController = _$componentController_;
    patientService = _patientService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    sessionService = _sessionService_;
  }));

  describe('$onInit', () => {

    describe('existing patient', () => {

      beforeEach(() => {
        spyOn(patientService, 'getOpenMRSPatient').and.callFake(() => $q.resolve({}));
      });

      it('should load existing OpenMRS patient', () => {

        var patient = { uuid: 'b54dfb5d-9e54-4d28-ad67-b3673cefaad2' };

        var ctrl = $componentController('patientWizard', null, { patient });

        ctrl.$onInit();

        expect(patientService.getOpenMRSPatient).toHaveBeenCalledWith(patient.uuid);

      });

      it('should set state prefix', () => {

        var patient = { uuid: 'b54dfb5d-9e54-4d28-ad67-b3673cefaad2' };

        var ctrl = $componentController('patientWizard', null, { patient });

        ctrl.$onInit();

        expect(ctrl.srefPrefix).toEqual('editpatient');

      });

      it('should set header text', () => {

        var patient = { uuid: 'b54dfb5d-9e54-4d28-ad67-b3673cefaad2' };

        var ctrl = $componentController('patientWizard', null, { patient });

        ctrl.$onInit();

        expect(ctrl.headerText).toEqual('PATIENT_INFO_EDIT');

      });

    });

  });

  describe('save', () => {

    describe('existing patient', () => {

      it('should update the patient', () => {

        var patient = { uuid: 'b54dfb5d-9e54-4d28-ad67-b3673cefaad2' };

        spyOn(patientService, 'updatePatientProfile').and.callFake(() => $q.resolve({}));

        var ctrl = $componentController('patientWizard', null, { patient });

        ctrl.$onInit();

        ctrl.save();

        expect(patientService.updatePatientProfile).toHaveBeenCalled();

      });

    });

    describe('new patient', () => {

      it('should create the patient', () => {

        var patient = {};

        spyOn(patientService, 'createPatientProfile').and.callFake(() => $q.resolve({}));

        var ctrl = $componentController('patientWizard', null, { patient });

        ctrl.$onInit();

        ctrl.save();

        expect(patientService.createPatientProfile).toHaveBeenCalled();

      });

    });

  });

  describe('linkCancel', () => {

    describe('editing patient', () => {

      it('should navigate to given return state', () => {

        var patient = { uuid: 'b54dfb5d-9e54-4d28-ad67-b3673cefaad2' };
        var $state = jasmine.createSpyObj('$state', ['go']);
        var $stateParams = { returnState: 'dashboard' };

        var ctrl = $componentController('patientWizard', { $state, $stateParams }, { patient });

        ctrl.$onInit();

        ctrl.linkCancel();

        expect($state.go).toHaveBeenCalledWith($stateParams.returnState, { patientUuid: patient.uuid });

      });

    });

    describe('creating patient', () => {

      it('should navigate to search patient state', () => {

        var $state = jasmine.createSpyObj('$state', ['go']);
        var ctrl = $componentController('patientWizard', { $state });

        ctrl.linkCancel();

        expect($state.go).toHaveBeenCalledWith('search');

      });

    });

  });

});
