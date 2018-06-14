describe('apps', function () {

  var $componentController, $q, $rootScope, appService, applicationService;

  beforeEach(module('bahmni.common.appFramework'));

  beforeEach(inject(function (_$componentController_, _$q_, _$rootScope_, _appService_, _applicationService_) {
    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    appService = _appService_;
    applicationService = _applicationService_;
  }));

  describe('$onInit', function () {

    beforeEach(function () {

      spyOn(appService, 'getAppDescriptor').and.returnValue({id: 'registration'});

      spyOn(applicationService, 'getApps').and.callFake(function () {
        return $q(function (resolve) {
          return resolve([{active: false}, {active: true}, {active: true, id: 'registration'}]);
        });
      });

    });

    it('should get current app', function () {

      var ctrl = $componentController('apps');

      ctrl.$onInit();

      expect(ctrl.currentApp).toEqual({id: 'registration'});

    });

    it('should get all active apps', function () {

      var ctrl = $componentController('apps');

      ctrl.$onInit();

      $rootScope.$apply();

      var allActive = ctrl.apps.every(function (a) {
        return a.active;
      });
      expect(allActive).toEqual(true);

    });

    it('should get all apps different from current app', function () {

      var ctrl = $componentController('apps');

      ctrl.$onInit();

      $rootScope.$apply();

      expect(ctrl.apps).not.toContain(jasmine.objectContaining({id: 'registration'}));

    });

  });

});
