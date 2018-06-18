describe('apps', () => {

  var $componentController, $q, $rootScope, appService, applicationService;

  beforeEach(module('bahmni.common.appFramework'));

  beforeEach(inject((_$componentController_, _$q_, _$rootScope_, _appService_, _applicationService_) => {
    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    appService = _appService_;
    applicationService = _applicationService_;
  }));

  describe('$onInit', () => {

    beforeEach(() => {

      spyOn(appService, 'getAppDescriptor').and.returnValue({id: 'registration'});

      spyOn(applicationService, 'getApps').and.callFake(() => $q(resolve => resolve([{active: false}, {active: true}, {
        active: true,
        id: 'registration'
      }])));

    });

    it('should get current app', () => {

      var ctrl = $componentController('apps');

      ctrl.$onInit();

      expect(ctrl.currentApp).toEqual({id: 'registration'});

    });

    it('should get all active apps', () => {

      var ctrl = $componentController('apps');

      ctrl.$onInit();

      $rootScope.$apply();

      var allActive = ctrl.apps.every(a => a.active);
      expect(allActive).toEqual(true);

    });

    it('should get all apps different from current app', () => {

      var ctrl = $componentController('apps');

      ctrl.$onInit();

      $rootScope.$apply();

      expect(ctrl.apps).not.toContain(jasmine.objectContaining({id: 'registration'}));

    });

  });

});
