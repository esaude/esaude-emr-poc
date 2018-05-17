describe('LabRequestController', function () {

  var controller, $controller, providerService, testProfileService, testService, $q, $rootScope, $http, notifier, testOrderService, sessionService,
    testOrderResultService, visitService;
  var PROVIDERS = [{ display: "Alberto" }, { display: "Zacarias" }, { display: "Cossa" }];
  var TEST_PROFILES = [{ name: "Profile Um", tests: ["UUID1", "UUID2"] }, { name: "Profile Dois", tests: ["UUID2"] }];
  var TESTS = [{ display: "Teste 1", testOrder: { uuid: "UUID1" } }, { display: "Teste 2", testOrder: { uuid: "UUID2" } }];
  var TEST_ORDERS = [];
  var TEST_ORDER_ITEMS = ["TEST1", "TEST2"];
  var TEST_ORDER = {
    testOrderItems: TEST_ORDER_ITEMS,
    status: "NEW"
  };

  beforeEach(module('common.test', function ($provide, $translateProvider, $urlRouterProvider) {
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

  beforeEach(inject(function (_$controller_, _$q_, _$rootScope_, $httpBackend, _providerService_, _testProfileService_,
    _testService_, _notifier_, _testOrderService_, _sessionService_, _testOrderResultService_, _visitService_) {

    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    $http = $httpBackend;
    providerService = _providerService_;
    testProfileService = _testProfileService_;
    testService = _testService_;
    notifier = _notifier_;
    testOrderService = _testOrderService_;
    sessionService = _sessionService_;
    testOrderResultService = _testOrderResultService_;
    visitService = _visitService_;
  }));

  beforeEach(function () {
    $http.expectGET("/openmrs/ws/rest/v1/user?v=custom:(username,uuid,person:(uuid,preferredName),privileges:(name,retired),userProperties)").respond({});
    $http.expectGET("/openmrs/ws/rest/v1/visit?v=full").respond({});

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
    spyOn(testOrderService, 'getTestOrdersByPatientUuid').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(TEST_ORDERS);
      });
    });
    spyOn(testOrderService, 'create').and.callFake(function () {
      return $q(function (resolve) {
        return resolve({});
      });
    });
    spyOn(sessionService, 'getCurrentProvider').and.callFake(function () {
      return $q(function (resolve) {
        return resolve({});
      });
    });
    spyOn(sessionService, 'getCurrentLocation').and.callFake(function () {
      return $q(function (resolve) {
        return resolve({ uuid: "UUIDLocation1" });
      });
    });
    spyOn(visitService, 'getTodaysVisit').and.callFake(function () {
      return $q(function (resolve) {
        return resolve({});
      });
    });
    spyOn(notifier, 'error');

    controller = $controller('LabRequestController', {
    });
    controller.externalRequest = true;
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

  describe('removeTest', function () {
    it('should remove the selected test', function () {
      expect(controller.selectedTests.length).toEqual(0);
      var newTest = { display: "Teste Rápido HIV" };
      controller.selectedTest = newTest;
      controller.addTest();
      expect(controller.selectedTests.length).toEqual(1);
      controller.removeTest(newTest);
      expect(controller.selectedTests.length).toEqual(0);
    });
  });

  describe('saveTestOrderRequest', function () {
    it('should save', function () {
      controller.selectedProvider = { display: "Alberto" };
      controller.selectedTests = [{
        display: "Teste Rápido HIV",
        testOrder: { uuid: "UUID999" },
        category: { uuid: "UUIDCAT999" }
      }];
      controller.saveTestOrderRequest();
    });

    it('should not save if no tests', function () {
      controller.selectedProvider = { display: "Alberto" };
      controller.saveTestOrderRequest();
      expect(notifier.error).toHaveBeenCalled();
    });

    it('should save if provider is not from the list', function () {
      controller.selectedProvider = "Alberto";
      controller.selectedTests = [{
        display: "Teste Rápido HIV",
        testOrder: { uuid: "UUID999" },
        category: { uuid: "UUIDCAT999" }
      }];
      controller.saveTestOrderRequest();
      expect(notifier.error).toHaveBeenCalled();
    });
  });

  describe('showTestOrderDetails', function () {
    it('should show details', function () {
      controller.showTestOrderDetails(TEST_ORDER);
      expect(controller.testsOfSelectedRequest).toEqual(TEST_ORDER_ITEMS);
      expect(controller.testOrderInDetail).toEqual(TEST_ORDER);
    });
  });

  describe('isTestOrderInDetailCompleted', function () {
    it('should be reported as not completed', function () {
      controller.showTestOrderDetails(TEST_ORDER);
      expect(controller.isTestOrderInDetailCompleted()).toBeFalsy();
    });

    it('should be reported as completed', function () {
      TEST_ORDER.status = "COMPLETE";
      controller.showTestOrderDetails(TEST_ORDER);
      expect(controller.isTestOrderInDetailCompleted()).toBeTruthy();
    });

    it('should be reported as not completed if null', function () {
      expect(controller.isTestOrderInDetailCompleted()).toBeFalsy();
    });
  });

  describe('resetForm', function () {
    it('should reset all fields', function () {
      controller.date = {};
      controller.selectedProvider = {};
      controller.selectedTest = {};
      controller.selectedProfile = {};
      controller.selectedTests = {};
      controller.resetForm();
      expect(controller.date).toBeNull();
      expect(controller.selectedProvider).toBeNull();
      expect(controller.selectedTest).toBeNull();
      expect(controller.selectedProfile).toBeNull();
      expect(controller.selectedTests).toEqual([]);
    });
  });

});
