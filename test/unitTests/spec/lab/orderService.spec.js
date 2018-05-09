describe('orderService', function () {

  var $q, orderService, $httpBackend;

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

  beforeEach(inject(function(_orderService_, _$q_, _$httpBackend_) {
    $q = _$q_;
    orderService = _orderService_;
    $httpBackend = _$httpBackend_;
  }));


  describe('getOrder', function () {

    it('should load the order with given uuid', function () {

      var uuid = 'e90f1baa-bf29-4233-9e2a-8ae185ca20b1';

      $httpBackend.expectGET('/openmrs/ws/rest/v1/order/' + uuid).respond({uuid: 'e90f1baa-bf29-4233-9e2a-8ae185ca20b1'});

      var order = {};
      orderService.getOrder(uuid).then(function (o) {
        order = o;
      });

      $httpBackend.flush();

      expect(order).toEqual({uuid: 'e90f1baa-bf29-4233-9e2a-8ae185ca20b1'});

    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

  });

});
