describe('patientWizard', function () {

  var $componentController, patientService, $q, $rootScope, sessionService, TabManager;

  beforeEach(module('common.patient', function ($provide, $translateProvider, $urlRouterProvider) {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject(function (_$componentController_, _patientService_, _$q_, _$rootScope_, _sessionService_, _TabManager_) {
    $componentController = _$componentController_;
    patientService = _patientService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    sessionService = _sessionService_;
    TabManager = _TabManager_;
  }));

  describe('$onInit', function () {

    describe('existing patient', function () {

      beforeEach(function () {
        spyOn(patientService, 'getOpenMRSPatient').and.callFake(function () {
          return $q.resolve({});
        });
      });

      it('should load existing OpenMRS patient', function () {

        var patient = {uuid: 'b54dfb5d-9e54-4d28-ad67-b3673cefaad2'};

        var ctrl = $componentController('patientWizard', null, {TabManager, patient});

        ctrl.$onInit();

        expect(patientService.getOpenMRSPatient).toHaveBeenCalledWith(patient.uuid);

      });

      it('should set state prefix', function () {

        var patient = {uuid: 'b54dfb5d-9e54-4d28-ad67-b3673cefaad2'};

        var ctrl = $componentController('patientWizard', null, {TabManager, patient});

        ctrl.$onInit();

        expect(ctrl.srefPrefix).toEqual('editpatient');

      });

      it('should set header text', function () {

        var patient = {uuid: 'b54dfb5d-9e54-4d28-ad67-b3673cefaad2'};

        var ctrl = $componentController('patientWizard', null, {TabManager, patient});

        ctrl.$onInit();

        expect(ctrl.headerText).toEqual('PATIENT_INFO_EDIT');

      });

    });

  });

  describe('changeStep', function () {

    it('should show error message when form is not valid and the user goes to next step', function () {

      var form = { $valid: false };
      var step = "name";
      var ctrl = $componentController('patientWizard', null, {TabManager, patient: {}});

      ctrl.$onInit();

      ctrl.setCurrentStep({form: form, getName: () => 'identifier'});

      expect(ctrl.showMessages).toBe(false);

      ctrl.changeStep(step);

      expect(ctrl.showMessages).toBe(true);

    });

    it('should allow the user to go to a previous step even when the form is invalid', function () {

      var form = { $valid: false };
      var step = "identifier";
      var $state = jasmine.createSpyObj('$state', ['go']);
      var ctrl = $componentController('patientWizard', {$state}, {TabManager, patient: {}});

      ctrl.$onInit();

      ctrl.setCurrentStep({form: form, getName: () => 'name'});

      ctrl.changeStep(step);

      expect($state.go).toHaveBeenCalledWith(`newpatient.${step}`);

    });

    it('should allow the user to go to a next step when the form is valid', function () {

      var form = { $valid: true };
      var step = "name";
      var $state = jasmine.createSpyObj('$state', ['go']);
      var ctrl = $componentController('patientWizard', {$state}, {TabManager, patient: {}});

      ctrl.$onInit();

      ctrl.setCurrentStep({form: form, getName: () => 'identifier'});

      ctrl.changeStep(step);

      expect($state.go).toHaveBeenCalledWith(`newpatient.${step}`);

    });

    it('should not allow the user to jump steps', function () {

      var form = { $valid: true };
      var step = "gender";
      var $state = jasmine.createSpyObj('$state', ['go']);
      var ctrl = $componentController('patientWizard', {$state}, {TabManager, patient: {}});

      ctrl.$onInit();

      ctrl.setCurrentStep({form: form, getName: () => 'identifier'});

      ctrl.changeStep(step);

      expect($state.go).not.toHaveBeenCalled();

    });

    it('should notify the user when jumping steps', function () {

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

  describe('save', function () {

    describe('existing patient', function () {

      it('should update the patient', function () {

        var patient = {uuid: 'b54dfb5d-9e54-4d28-ad67-b3673cefaad2'};

        spyOn(patientService, 'updatePatientProfile').and.callFake(function () {
          return $q.resolve({});
        });

        var ctrl = $componentController('patientWizard', null, {TabManager, patient});

        ctrl.$onInit();

        ctrl.save();

        expect(patientService.updatePatientProfile).toHaveBeenCalled();

      });

    });

    describe('new patient', function () {

      it('should create the patient', function () {

        var patient = {};

        spyOn(patientService, 'createPatientProfile').and.callFake(function () {
          return $q.resolve({});
        });

        var ctrl = $componentController('patientWizard', null, {TabManager, patient});

        ctrl.$onInit();

        ctrl.save();

        expect(patientService.createPatientProfile).toHaveBeenCalled();

      });

    });

  });

  describe('stepForward', function () {

    describe('valid form', function () {

      it('should go to next step', function () {

        var patient = {};
        var form = {$valid: true};
        var $state = jasmine.createSpyObj('$state', ['go']);

        var ctrl = $componentController('patientWizard', {$state}, {TabManager, patient});

        ctrl.$onInit();

        ctrl.setCurrentStep({form, getName: () => 'identifier'});

        ctrl.stepForward();

        expect($state.go).toHaveBeenCalledWith('newpatient.name');

      });

      it('should hide messages', function () {

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


    describe('invalid form', function () {

      it('should show messages', function () {

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

  describe('linkCancel', function () {

    describe('editing patient', function () {

      it('should navigate to given return state', function () {

        var patient = {uuid: 'b54dfb5d-9e54-4d28-ad67-b3673cefaad2'};
        var $state = jasmine.createSpyObj('$state', ['go']);
        var $stateParams = {returnState: 'dashboard'};

        var ctrl = $componentController('patientWizard', {$state, $stateParams}, {TabManager, patient});

        ctrl.$onInit();

        ctrl.linkCancel();

        expect($state.go).toHaveBeenCalledWith($stateParams.returnState, {patientUuid: patient.uuid});

      });

    });

    describe('creating patient', function () {

      it('should navigate to search patient state', function () {

        var $state = jasmine.createSpyObj('$state', ['go']);
        var ctrl = $componentController('patientWizard', {$state});

        ctrl.linkCancel();

        expect($state.go).toHaveBeenCalledWith('search');

      });

    });

  });

});
