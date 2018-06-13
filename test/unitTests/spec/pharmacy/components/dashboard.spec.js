describe('dashboard', function () {

  var $componentController, $state, $stateParams, patientService, visitService, $rootScope;

  beforeEach(module('pharmacy', function ($provide, $translateProvider, $urlRouterProvider) {
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

  beforeEach(inject(function (_$componentController_, _$q_, _$rootScope_, _patientService_, _visitService_, _$state_) {
    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    patientService = _patientService_;
    visitService = _visitService_;
    $state = _$state_;
  }));


  describe('reload', function () {

    it('should reload current state', function () {

      spyOn($state, 'reload');

      var ctrl = $componentController('dashboard');
      ctrl.reload();

      expect($state.reload).toHaveBeenCalled();

    });

  });

});
