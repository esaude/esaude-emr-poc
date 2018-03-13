describe('TestOrderDetailsController', function () {

  var $componentController, $q, $rootScope, testService;

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

  beforeEach(inject(function (_$componentController_, _patientService_, _$q_, _$rootScope_, _testService_) {
    $componentController = _$componentController_;
    $q = _$q_;
    testService = _testService_;
    $rootScope = _$rootScope_;
  }));


  describe('saveTestResultItem', function () {

    beforeEach(function () {
      spyOn(testService, 'saveTestResultItem').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({uuid: 'new', value: 0.1});
        });
      });
    });

    it('should save the given test result item', function () {

      var ctrl = $componentController('testOrderResultDetails', null, {testOrderResult: {items: []}});

      ctrl.saveTestResultItem({}, 0.1);

      expect(testService.saveTestResultItem).toHaveBeenCalled();

    });

    it('should set the result value', function () {

      var item = {value: ''};
      var testResult = {items: [item]};

      var ctrl = $componentController('testOrderResultDetails', null, {testOrderResult: testResult});

      ctrl.saveTestResultItem(item, 0.1);
      $rootScope.$apply();

      expect(testResult.items[0].value).toEqual(0.1);

    });

    it('should update the result uuid', function () {

      var item = {value: ''};
      var testResult = {items: [item]};

      var ctrl = $componentController('testOrderResultDetails', null, {testOrderResult: testResult});

      ctrl.saveTestResultItem(item, 0.1);
      $rootScope.$apply();

      expect(testResult.items[0].uuid).toEqual('new');

    });

    it('should update the item', function () {

      var item = {value: ''};
      var testResult = {items: [item]};

      var ctrl = $componentController('testOrderResultDetails', null, {testOrderResult: testResult});

      ctrl.saveTestResultItem(item, 0.1);
      $rootScope.$apply();

      expect(testResult.items[0]).toBeDefined();
      expect(testResult.items[0]).not.toBe(item);

    });

  });

  describe('getTestOrderItemValue', function () {

    it('should return the test order item value', function () {

      var ctrl = $componentController('testOrderResultDetails');

      var value = ctrl.getTestOrderItemValue({testOrderResult: {}, value: 42});

      expect(value).toEqual(42);

    });

    describe('coded datatype concept', function () {

      it('should return the name from one of the possible answers', function () {

        var ctrl = $componentController('testOrderResultDetails');

        var value = ctrl.getTestOrderItemValue({
          testOrderResult: {
            concept: {
              datatype: {display: 'Coded'},
              answers: [{
                uuid: '0044c630-9086-11e6-a98e-000c29db4475',
                display: 'Acute Nephritic Syndrome, Focal and Segmental Glomerular Lesions'
              }]
            }
          },
          value: '0044c630-9086-11e6-a98e-000c29db4475'
        });

        expect(value).toEqual('Acute Nephritic Syndrome, Focal and Segmental Glomerular Lesions');

      });

    });

  });

  describe('removeTestResultItem', function () {

    beforeEach(function () {
      spyOn(testService, 'removeTestResultItem').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });
    });

    it('should delete the test order result item value', function () {

      var item = {value: ''};
      var testResult = {items: [item]};

      var ctrl = $componentController('testOrderResultDetails', null, {testOrderResult: {items: []}});

      ctrl.removeTestResultItem(item);

      expect(testService.removeTestResultItem).toHaveBeenCalled();

    });


    it('call the test reload test order result binding', function () {

      var item = {value: 777};
      var testResult = {items: [item]};

      var reload = jasmine.createSpy('reloadTestOrderResult');

      var ctrl = $componentController('testOrderResultDetails', null, {reloadTestOrderResult: reload});

      ctrl.removeTestResultItem(item);
      $rootScope.$apply();

      expect(reload).toHaveBeenCalled();

    });

  });

});
