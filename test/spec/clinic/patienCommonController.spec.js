'use strict';

describe('PatientCommonController', function () {

  var controller, $controller, $http,conceptService, patientAttributeService, patientService, $q, $rootScope;



  beforeEach(module('clinic', function ($provide, $translateProvider) {
    // Mock initialization
    $provide.factory('initialization', function () {
    });
    // Mock appService
    var appService = jasmine.createSpyObj('appService', ['initApp']);
    appService.initApp.and.returnValue({
      then: function (fn) {
      }
    });
    $provide.value('appService', appService);
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

  beforeEach(inject(function (_$controller_, _$httpBackend_, _patientAttributeService_, _patientService_, _$q_, _$rootScope_,_conceptService_) {
      $q = _$q_;
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      $http = _$httpBackend_;
      patientAttributeService = _patientAttributeService_;
      patientService = _patientService_;
      conceptService = _conceptService_;
    })
  );

  describe('activate', function () {

    var patientConfig;

    beforeEach(function () {
      spyOn(conceptService, 'getDeathConcepts').and.callFake(function () {
        return $q(function (resolve) {
          return resolve([]);
        })
      });

      controller = $controller('PatientCommonController', {
        $scope: {
          patientConfiguration: patientConfig
        },
        patientService: patientService
      });
    });

    it('should load deathConcepts ', function () {
      $rootScope.$apply();
      expect(controller.deathConcepts).toEqual([]);
    });

  });

});
