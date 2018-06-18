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

  beforeEach(inject((_$componentController_, _patientService_, _$q_, _$rootScope_, _sessionService_, _TabManager_) => {
    $componentController = _$componentController_;
    patientService = _patientService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    sessionService = _sessionService_;
    TabManager = _TabManager_;
  }));

  describe('$onInit', () => {

    describe('existing patient', () => {

      beforeEach(() => {
        spyOn(patientService, 'getOpenMRSPatient').and.callFake(() => $q.resolve({}));
      });

      it('should load existing OpenMRS patient', () => {

        var patient = {uuid: 'b54dfb5d-9e54-4d28-ad67-b3673cefaad2'};

        var ctrl = $componentController('patientWizard', null, {TabManager, patient});

        ctrl.$onInit();

        expect(patientService.getOpenMRSPatient).toHaveBeenCalledWith(patient.uuid);

      });

      it('should set state prefix', () => {

        var patient = {uuid: 'b54dfb5d-9e54-4d28-ad67-b3673cefaad2'};

        var ctrl = $componentController('patientWizard', null, {TabManager, patient});

        ctrl.$onInit();

        expect(ctrl.srefPrefix).toEqual('editpatient');

      });

      it('should set header text', () => {

        var patient = {uuid: 'b54dfb5d-9e54-4d28-ad67-b3673cefaad2'};

        var ctrl = $componentController('patientWizard', null, {TabManager, patient});

        ctrl.$onInit();

        expect(ctrl.headerText).toEqual('PATIENT_INFO_EDIT');

      });

    });

  });

  describe('changeStep', () => {

    it('should show error message when form is not valid and the user goes to next step', () => {

      var form = { $valid: false };
      var step = "name";
      var ctrl = $componentController('patientWizard', null, {TabManager, patient: {}});

      ctrl.$onInit();

      ctrl.setCurrentStep({form: form, getName: () => 'identifier'});

      expect(ctrl.showMessages).toBe(false);

      ctrl.changeStep(step);

      expect(ctrl.showMessages).toBe(true);

    });

    it('should allow the user to go to a previous step even when the form is invalid', () => {

      var form = { $valid: false };
      var step = "identifier";
      var $state = jasmine.createSpyObj('$state', ['go']);
      var ctrl = $componentController('patientWizard', {$state}, {TabManager, patient: {}});

      ctrl.$onInit();

      ctrl.setCurrentStep({form: form, getName: () => 'name'});

      ctrl.changeStep(step);

      expect($state.go).toHaveBeenCalledWith(`newpatient.${step}`);

    });

    it('should allow the user to go to a next step when the form is valid', () => {

      var form = { $valid: true };
      var step = "name";
      var $state = jasmine.createSpyObj('$state', ['go']);
      var ctrl = $componentController('patientWizard', {$state}, {TabManager, patient: {}});

      ctrl.$onInit();

      ctrl.setCurrentStep({form: form, getName: () => 'identifier'});

      ctrl.changeStep(step);

      expect($state.go).toHaveBeenCalledWith(`newpatient.${step}`);

    });

    it('should not allow the user to jump steps', () => {

      var form = { $valid: true };
      var step = "gender";
      var $state = jasmine.createSpyObj('$state', ['go']);
      var ctrl = $componentController('patientWizard', {$state}, {TabManager, patient: {}});

      ctrl.$onInit();

      ctrl.setCurrentStep({form: form, getName: () => 'identifier'});

      ctrl.changeStep(step);

      expect($state.go).not.toHaveBeenCalled();

    });

    it('should notify the user when jumping steps', () => {

      var form = { $valid: true };
      var step = "gender";
      var notifier = jasmine.createSpyObj('notifier', ['warning']);
      var ctrl = $componentController('patientWizard', {notifier: notifier}, {TabManager, patient: {}});

      ctrl.$onInit();

      ctrl.setCurrentStep({form: form, getName: () => 'identifier'});

      ctrl.changeStep(step);

      expect(notifier.warning).toHaveBeenCalled();

    });

  });

  describe('save', () => {

    describe('existing patient', () => {

      it('should update the patient', () => {

        var patient = {uuid: 'b54dfb5d-9e54-4d28-ad67-b3673cefaad2'};

        spyOn(patientService, 'updatePatientProfile').and.callFake(() => $q.resolve({}));

        var ctrl = $componentController('patientWizard', null, {TabManager, patient});

        ctrl.$onInit();

        ctrl.save();

        expect(patientService.updatePatientProfile).toHaveBeenCalled();

      });

    });

    describe('new patient', () => {

      it('should create the patient', () => {

        var patient = {};

        spyOn(patientService, 'createPatientProfile').and.callFake(() => $q.resolve({}));

        var ctrl = $componentController('patientWizard', null, {TabManager, patient});

        ctrl.$onInit();

        ctrl.save();

        expect(patientService.createPatientProfile).toHaveBeenCalled();

      });

    });

  });

  describe('stepForward', () => {

    describe('valid form', () => {

      it('should go to next step', () => {

        var patient = {};
        var form = {$valid: true};
        var $state = jasmine.createSpyObj('$state', ['go']);

        var ctrl = $componentController('patientWizard', {$state}, {TabManager, patient});

        ctrl.$onInit();

        ctrl.setCurrentStep({form, getName: () => 'identifier'});

        ctrl.stepForward();

        expect($state.go).toHaveBeenCalledWith('newpatient.name');

      });

      it('should hide messages', () => {

        var patient = {};
        var form = {$valid: true};
        var $state = jasmine.createSpyObj('$state', ['go']);

        var ctrl = $componentController('patientWizard', {$state}, {TabManager, patient});

        ctrl.$onInit();

        ctrl.setCurrentStep({form, getName: () => 'identifier'});

        ctrl.stepForward();

        expect(ctrl.showMessages).toEqual(false);

      });

    });


    describe('invalid form', () => {

      it('should show messages', () => {

        var patient = {};
        var form = {$valid: false};
        var $state = jasmine.createSpyObj('$state', ['go']);

        var ctrl = $componentController('patientWizard', {$state}, {TabManager, patient});

        ctrl.$onInit();

        ctrl.setCurrentStep({form, getName: () => 'identifier'});

        ctrl.stepForward();

        expect(ctrl.showMessages).toEqual(true);

      });

    });

  });

  describe('linkCancel', () => {

    describe('editing patient', () => {

      it('should navigate to given return state', () => {

        var patient = {uuid: 'b54dfb5d-9e54-4d28-ad67-b3673cefaad2'};
        var $state = jasmine.createSpyObj('$state', ['go']);
        var $stateParams = {returnState: 'dashboard'};

        var ctrl = $componentController('patientWizard', {$state, $stateParams}, {TabManager, patient});

        ctrl.$onInit();

        ctrl.linkCancel();

        expect($state.go).toHaveBeenCalledWith($stateParams.returnState, {patientUuid: patient.uuid});

      });

    });

    describe('creating patient', () => {

      it('should navigate to search patient state', () => {

        var $state = jasmine.createSpyObj('$state', ['go']);
        var ctrl = $componentController('patientWizard', {$state});

        ctrl.linkCancel();

        expect($state.go).toHaveBeenCalledWith('search');

      });

    });

  });

});
