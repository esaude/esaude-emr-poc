describe('ScheduleListController', function () {

  var scope, $rootScope, $controller, controller, observationService, commonService, visitService, cohortService;

  var visits = [];

  beforeEach(module('clinic', function ($provide, $translateProvider) {

    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
  }));


  //TODO: Finalize the test after observation Service
  describe('init', function() {
        beforeEach(inject(function (_$q_, _$controller_, _$rootScope_, _commonService_, _visitService_, _observationsService_, _cohortService_, _$httpBackend_)  {
          $q = _$q_;
          $rootScope = _$rootScope_;
          scope = _$rootScope_.$new();
          $controller = _$controller_;
          observationService = _observationsService_;
          commonService = _commonService_;
          visitService = _visitService_;
          cohortService= _cohortService_;
          $httpBackend = _$httpBackend_;
        }));

        beforeEach(function () {
          var currentProvider = {
            uuid: '8d4a4488-c2cc-11de-8d13-0010c6dffd0f'

          };
          $rootScope.currentProvider = currentProvider;

          spyOn(observationService, 'getObs').and.callFake(function() {
              return $q(function (resolve) {
                return resolve([]);
              });
          });

          spyOn(visitService, 'search').and.callFake(function() {
              return $q(function(resolve) {
                return resolve(visits);
              });
          });

          spyOn(cohortService, 'getWithParams').and.callFake(function () {
              return {
                success: function () {
                return {members: [] };
              }
          };
          });

          controller = $controller('ScheduleListController',  {
            $scope: scope,
            $rootScope: $rootScope,
            observationService: observationService,
            visitService: visitService
          });

        });
          it('should call the patient last consultations', function () {



              var uuid = 'd00c4b2e-7c13-4d05-9f87-8a9c4b07ad52?providerUuid=8d4a4488-c2cc-11de-8d13-0010c6dffd0f';
              var currentProvider = {
                uuid: '8d4a4488-c2cc-11de-8d13-0010c6dffd0f'

              }
              $rootScope.currentProvider = currentProvider;

              scope.getLastConsultationAndVisit();

              visitService.search();
              expect(visitService.search).toHaveBeenCalled();

          });
  });

});
