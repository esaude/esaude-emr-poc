describe('patientGenderStep', () => {

  var $componentController;

  beforeEach(module('common.patient', ($provide, $translateProvider, $urlRouterProvider) => {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', $q => () => {
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject((_$componentController_) => {
    $componentController = _$componentController_;
  }));

  describe('$onInit', () => {
    it('show do nothing', () => {
      var ctrl = $componentController('patientGenderStep', null, {});
      ctrl.$onInit();
    });
  });

});
