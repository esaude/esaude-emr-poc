describe('VitalsController', function () {

  var controller, $controller,  observationsService, visitService, $rootScope;

  beforeEach(module('vitals', function ($provide, $translateProvider, $urlRouterProvider) {
    // Mock initialization
    $provide.factory('initialization', function () {
    });
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

  beforeEach(inject(function (_$controller_, _$q_, _$rootScope_, _observationsService_,
                              _visitService_, $httpBackend) {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    observationsService = _observationsService_;
    visitService = _visitService_;
    $http = $httpBackend;
  }));

  describe('init', function () {
      var lastVisit, lastBmi, lastHeight;
      beforeEach(function () {
        spyOn(observationsService, 'getLastPatientObs').and.callFake(function () {
          return $q(function (resolve) {
            return resolve({});
          });
        });
        spyOn(visitService, 'search').and.callFake(function () {
          return $q(function (resolve) {
            return resolve({});
          });
        });
      });
      it('should fecthc the concepts and vitals for the patient', function () {
        controller = $controller('VitalsController', {
           $scope: {
              lastBmi: lastBmi,
                lastHeight: lastHeight,
               lastVisit: lastVisit
           }
        });
        var query = '/openmrs/ws/rest/v1/visit?v=custom:(visitType,startDatetime,stopDatetime,uuid,encounters)';
          $http.expectGET(query).respond({results: []});
          // $http.flush();

          $rootScope.$apply();
          expect(observationsService.getLastPatientObs).toHaveBeenCalled();

          // visitService.search();
          // expect(controller.$scope).toBeDefined();
      });
      it('should search patient', function () {
        visitService.search();
        $rootScope.$apply();
        expect(visitService.search).toHaveBeenCalled();
      });
  });
});
