describe('LabRequestController', function () {

  var controller, $controller, providerService, testProfileService, testService, $q, $rootScope, $http, notifier;
  var PROVIDERS = [{ display: "Alberto" }, { display: "Zacarias" }, { display: "Cossa" }];
  var TEST_PROFILES = [{ name: "Profile Um", tests: ["UUID1", "UUID2"] }, { name: "Profile Dois", tests: ["UUID2"] }];
  var TESTS = [{ display: "Teste 1", testOrder: { uuid: "UUID1" } }, { display: "Teste 2", testOrder: { uuid: "UUID2" } }];

  beforeEach(module('clinic', function ($urlRouterProvider) {
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject(function (_$controller_, _$q_, _$rootScope_, $httpBackend, _providerService_, _testProfileService_, _testService_, _notifier_) {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $http = $httpBackend;
    providerService = _providerService_;
    testProfileService = _testProfileService_;
    testService = _testService_;
    notifier = _notifier_;
  }));

  beforeEach(function () {
    $http.expectGET("/poc_config/openmrs/i18n/common/locale_en.json").respond({});
    $http.expectGET("/openmrs/ws/rest/v1/testorderrequest?v=full").respond({});
    spyOn(providerService, 'getProviders').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(PROVIDERS);
      });
    });
    spyOn(testProfileService, 'getTestProfiles').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(TEST_PROFILES);
      });
    });
    spyOn(testService, 'getTests').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(TESTS);
      });
    });
    spyOn(notifier, 'error');

    controller = $controller('LabRequestController', {
    });
    $rootScope.$apply();
  });

  describe('activate', function () {
    it('should load providers, profiles and tests', function () {
      expect(controller.providers).toEqual(PROVIDERS);
      expect(controller.profiles).toEqual(TEST_PROFILES);
      expect(controller.tests).toEqual(TESTS);
    });
  });

  describe('addTest', function () {
    it('should add selected test to the list', function () {
      expect(controller.selectedTests.length).toEqual(0);
      var newTest = { display: "Teste Rápido HIV" };
      controller.selectedTest = newTest;
      controller.addTest();
      expect(controller.selectedTests.length).toEqual(1);
      expect(controller.selectedTests[0]).toEqual(newTest);
    });

    it('should not add if selected test is not valid', function () {
      expect(controller.selectedTests.length).toEqual(0);
      var newTest = "Teste Rápido HIV";
      controller.selectedTest = newTest;
      controller.addTest();
      expect(notifier.error).toHaveBeenCalled();
      expect(controller.selectedTests.length).toEqual(0);
    });

    it('should not add if selected test is already added', function () {
      expect(controller.selectedTests.length).toEqual(0);
      var newTest = { display: "Teste Rápido HIV" };
      controller.selectedTest = newTest;
      controller.addTest();
      expect(controller.selectedTests.length).toEqual(1);
      controller.selectedTest = newTest;
      controller.addTest();
      expect(notifier.error).toHaveBeenCalled();
      expect(controller.selectedTests.length).toEqual(1);
    });
  });

  describe('addTestProfile', function () {
    it('should add all tests linked to selected profile', function () {
      expect(controller.selectedTests.length).toEqual(0);
      controller.selectedProfile = TEST_PROFILES[0];
      controller.addTestProfile();
      expect(controller.selectedTests.length).toEqual(2);
      expect(controller.selectedTests[0].display).toEqual("Teste 1");
      expect(controller.selectedTests[1].display).toEqual("Teste 2");
    });

    it('should set profile name on added tests', function () {
      expect(controller.selectedTests.length).toEqual(0);
      controller.selectedProfile = TEST_PROFILES[1];
      controller.addTestProfile();
      expect(controller.selectedTests.length).toEqual(1);
      expect(controller.selectedTests[0].profileName).toEqual("Profile Dois");
    });

    it('should add only missing tests linked to selected profile', function () {
      expect(controller.selectedTests.length).toEqual(0);
      controller.selectedProfile = TEST_PROFILES[1];
      controller.addTestProfile();
      expect(controller.selectedTests.length).toEqual(1);
      expect(controller.selectedTests[0].display).toEqual("Teste 2");

      controller.selectedProfile = TEST_PROFILES[0];
      controller.addTestProfile();
      expect(controller.selectedTests.length).toEqual(2);
      expect(controller.selectedTests[0].display).toEqual("Teste 2");
      expect(controller.selectedTests[1].display).toEqual("Teste 1");
    });

    it('should only allow adding profiles from the list', function () {
      expect(controller.selectedTests.length).toEqual(0);
      controller.selectedProfile = "Gost profile";
      controller.addTestProfile();
      expect(notifier.error).toHaveBeenCalled();
      expect(controller.selectedTests.length).toEqual(0);
    });
  });

});
