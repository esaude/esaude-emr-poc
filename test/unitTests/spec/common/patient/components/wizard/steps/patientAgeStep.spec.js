describe('patientAgeStep', () => {

  var $componentController, currentDate;

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

  beforeEach(inject((_$componentController_, _patientService_, _$q_, _$rootScope_, _sessionService_) => {
    $componentController = _$componentController_;
    patientService = _patientService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    sessionService = _sessionService_;
  }));

  beforeEach(() => {
    currentDate = moment('2016-01-01');
    jasmine.clock().mockDate(currentDate.toDate());
  });

  describe('$onInit', () => {
    it('show set current date as max date', () => {
      var ctrl = $componentController('patientAgeStep', null, {});
      ctrl.$onInit();
      expect(ctrl.birthDatepickerOptions.maxDate).toEqual(currentDate.toDate());
    });
  });

});
