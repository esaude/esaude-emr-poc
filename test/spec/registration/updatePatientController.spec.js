describe('UpdatePatientController', function () {

  var $controller, $filter, $scope, $location, $state, $stateParams, patient, patientService, notifier, $q, $rootScope;

  beforeEach(module('registration', function ($provide, $translateProvider) {
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
  }));

  beforeEach(inject(function (_$controller_, _$q_, _$rootScope_, _patientService_) {
    $controller = _$controller_;
    patientService = _patientService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('activate', function () {

    beforeEach(function () {
      spyOn(patientService, 'getOpenMRSPatient').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });
    });

    it('should get the patient in OpenMRS schema', function () {

      var ctrl = $controller('UpdatePatientController', {
        $scope: {}
      });

      $rootScope.$apply();
      expect(patientService.getOpenMRSPatient).toHaveBeenCalled();
    });

  });

});
