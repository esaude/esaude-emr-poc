describe('TestOrderDetailsController', () => {

  var $componentController, $q, $rootScope, testOrderResultService;

  beforeEach(module('lab', ($provide, $translateProvider, $urlRouterProvider) => {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', $q => () => {
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject((_$componentController_, _patientService_, _$q_, _$rootScope_, _testOrderResultService_) => {
    $componentController = _$componentController_;
    $q = _$q_;
    testOrderResultService = _testOrderResultService_;
    $rootScope = _$rootScope_;
  }));


  describe('saveTestResultItem', () => {

    beforeEach(() => {
      spyOn(testOrderResultService, 'saveTestResultItem').and.callFake(() => $q(resolve => resolve({
        uuid: 'new',
        value: 0.1
      })));
    });

    it('should save the given test result item', () => {

      var ctrl = $componentController('testOrderResultDetails', null, {testOrderResult: {items: []}});

      ctrl.saveTestResultItem({}, 0.1);

      expect(testOrderResultService.saveTestResultItem).toHaveBeenCalled();

    });

    it('should set the result value', () => {

      var item = {value: ''};
      var testResult = {items: [item]};

      var ctrl = $componentController('testOrderResultDetails', null, {testOrderResult: testResult});

      ctrl.saveTestResultItem(item, 0.1);
      $rootScope.$apply();

      expect(testResult.items[0].value).toEqual(0.1);

    });

    it('should update the result uuid', () => {

      var item = {value: ''};
      var testResult = {items: [item]};

      var ctrl = $componentController('testOrderResultDetails', null, {testOrderResult: testResult});

      ctrl.saveTestResultItem(item, 0.1);
      $rootScope.$apply();

      expect(testResult.items[0].uuid).toEqual('new');

    });

    it('should update the item', () => {

      var item = {value: ''};
      var testResult = {items: [item]};

      var ctrl = $componentController('testOrderResultDetails', null, {testOrderResult: testResult});

      ctrl.saveTestResultItem(item, 0.1);
      $rootScope.$apply();

      expect(testResult.items[0]).toBeDefined();
      expect(testResult.items[0]).not.toBe(item);

    });

  });

  describe('getTestOrderItemValue', () => {

    it('should return the test order item value', () => {

      var ctrl = $componentController('testOrderResultDetails');

      var value = ctrl.getTestOrderItemValue({testOrderResult: {}, value: 42});

      expect(value).toEqual(42);

    });

    describe('coded datatype concept', () => {

      it('should return the name from one of the possible answers', () => {

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

  describe('removeTestResultItem', () => {

    beforeEach(() => {
      spyOn(testOrderResultService, 'removeTestResultItem').and.callFake(() => $q(resolve => resolve({})));
    });

    it('should delete the test order result item value', () => {

      var item = {value: ''};
      var testResult = {items: [item]};

      var ctrl = $componentController('testOrderResultDetails', null, {testOrderResult: {items: []}});

      ctrl.removeTestResultItem(item);

      expect(testOrderResultService.removeTestResultItem).toHaveBeenCalled();

    });


    it('call the test reload test order result binding', () => {

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
