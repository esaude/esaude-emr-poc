describe('LabTestsController', function () {

  var $componentController, $q, testService, $rootScope, conceptService, orderService;

  beforeEach(module('lab', function ($provide, $translateProvider, $urlRouterProvider) {
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

  beforeEach(inject(function (_$componentController_, _patientService_, _$q_, _testService_, _$rootScope_,
                              _orderService_, _conceptService_) {

    $componentController = _$componentController_;
    $q = _$q_;
    testService = _testService_;
    $rootScope = _$rootScope_;
    orderService = _orderService_;
    conceptService = _conceptService_

  }));

  describe('$onInit', function () {

    it('should load test orders for the patient', function () {

      spyOn(testService, 'getTestOrderResultsForPatient').and.callFake(function () {
        return $q(function (resolve) {
          return resolve([]);
        });
      });

      var ctrl = $componentController('labTests');

      ctrl.$onInit();

      expect(testService.getTestOrderResultsForPatient).toHaveBeenCalled();

    });

    it('it should select the first loaded test order', function () {

      var testOrders = [{items: []}];

      spyOn(testService, 'getTestOrderResultsForPatient').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(testOrders);
        });
      });

      spyOn(orderService, 'getOrder').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      spyOn(conceptService, 'getConcept').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      var ctrl = $componentController('labTests');

      ctrl.$onInit();
      $rootScope.$apply();

      expect(ctrl.selectedTestOrder).toEqual(testOrders[0]);

    });

  });


  describe('selectTestOrder', function () {

    it('load test order item concepts', function () {

      var testOrder = {items: [{testOrder: {uuid: 'ccf79510-2408-4632-9045-1e74d66fff4a'}}]};

      spyOn(orderService, 'getOrder').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({concept: {uuid: '0132bbbb-9089-11e6-a98e-000c29db4475'}});
        });
      });

      spyOn(conceptService, 'getConcept').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      var ctrl = $componentController('labTests');

      ctrl.selectTestOrderResult(testOrder);
      $rootScope.$apply();

      expect(conceptService.getConcept).toHaveBeenCalled();

    });

    it('should assign the given test order to selected test order', function () {

      var testOrder = {items: [{testOrder: {uuid: 'ccf79510-2408-4632-9045-1e74d66fff4a'}}]};

      spyOn(orderService, 'getOrder').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({concept: {uuid: '0132bbbb-9089-11e6-a98e-000c29db4475'}});
        });
      });

      spyOn(conceptService, 'getConcept').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      var ctrl = $componentController('labTests');

      ctrl.selectTestOrderResult(testOrder);
      $rootScope.$apply();

      expect(ctrl.selectedTestOrder).toEqual(testOrder);

    });

    it('should mark as selected', function () {

      var testOrder = {items: [{testOrder: {uuid: 'ccf79510-2408-4632-9045-1e74d66fff4a'}}]};

      spyOn(orderService, 'getOrder').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({concept: {uuid: '0132bbbb-9089-11e6-a98e-000c29db4475'}});
        });
      });

      spyOn(conceptService, 'getConcept').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      var ctrl = $componentController('labTests');

      ctrl.selectTestOrderResult(testOrder);
      $rootScope.$apply();

      expect(ctrl.selectedTestOrder.selected).toEqual(true);

    });

    it('should mark others as not selected', function () {

      var testOrder = {items: [{testOrder: {uuid: 'ccf79510-2408-4632-9045-1e74d66fff4a'}}]};

      var testOrder2 = {items: [{testOrder: {uuid: 'ccf79510-2408-4632-9045-1e74d66fff4a'}}]};

      spyOn(orderService, 'getOrder').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({concept: {uuid: '0132bbbb-9089-11e6-a98e-000c29db4475'}});
        });
      });

      spyOn(conceptService, 'getConcept').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      var ctrl = $componentController('labTests');

      ctrl.testOrderResults = [testOrder, testOrder2];
      ctrl.selectTestOrderResult(testOrder);
      $rootScope.$apply();

      expect(ctrl.testOrderResults[1].selected).toEqual(false);

    });

  });


  describe('reloadTestOrderResult', function () {

    it('should load test result', function () {

      spyOn(testService, 'getTestOrderResult').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({uuid: '6a19b385-223f-45eb-8a8f-bf7b142ecde9', items: [{value: 1}]});
        });
      });

      var ctrl = $componentController('labTests');

      ctrl.reloadTestOrderResult({uuid: '6a19b385-223f-45eb-8a8f-bf7b142ecde9'});

      expect(testService.getTestOrderResult).toHaveBeenCalled();

    });

    it('should load the loaded test result concepts', function () {

      var testOrderResult = {uuid: '6a19b385-223f-45eb-8a8f-bf7b142ecde9', items: []};
      var loaded = {uuid: '6a19b385-223f-45eb-8a8f-bf7b142ecde9', items: [{testOrder: {uuid: 'uuid'}, value: 1}]};

      spyOn(orderService, 'getOrder').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({concept: {uuid: '0132bbbb-9089-11e6-a98e-000c29db4475'}});
        });
      });

      spyOn(conceptService, 'getConcept').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      spyOn(testService, 'getTestOrderResult').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(loaded);
        });
      });

      var ctrl = $componentController('labTests');

      ctrl.testOrderResults = [testOrderResult];
      ctrl.reloadTestOrderResult(testOrderResult);
      $rootScope.$apply();

      expect(conceptService.getConcept).toHaveBeenCalled();
      expect(orderService.getOrder).toHaveBeenCalled();

    });

    it('should update the loaded test result', function () {

      var testOrderResult = {uuid: '6a19b385-223f-45eb-8a8f-bf7b142ecde9', items: []};
      var loaded = {uuid: '6a19b385-223f-45eb-8a8f-bf7b142ecde9', items: [{testOrder: {uuid: 'uuid'}, value: 1}]};

      spyOn(orderService, 'getOrder').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({concept: {uuid: '0132bbbb-9089-11e6-a98e-000c29db4475'}});
        });
      });

      spyOn(conceptService, 'getConcept').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      spyOn(testService, 'getTestOrderResult').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(loaded);
        });
      });

      var ctrl = $componentController('labTests');

      ctrl.testOrderResults = [testOrderResult];
      ctrl.reloadTestOrderResult(testOrderResult);
      $rootScope.$apply();

      expect(ctrl.testOrderResults).toContain(loaded);
      expect(ctrl.testOrderResults).not.toContain(testOrderResult);

    });

  });

});
