describe('SexualPartnerFormController', function () {

  var $componentController, $q, $rootScope, sexualPartnersService;

  beforeEach(module('social', function ($provide, $translateProvider, $urlRouterProvider) {
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

  beforeEach(inject(function (_$componentController_, _$q_, _$rootScope_, _sexualPartnersService_) {

    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    sexualPartnersService = _sexualPartnersService_;
  }));

  describe('$onInit', function () {

    it('should load form data', function () {

      spyOn(sexualPartnersService, 'getFormData').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({relationshipToPatient: 'relationshipToPatient', hivStatus: 'hivStatus'});
        });
      });

      var ctrl = $componentController('sexualPartnerForm');

      ctrl.$onInit();

      $rootScope.$apply();

      expect(ctrl.relationshipToPatient).toEqual('relationshipToPatient');
      expect(ctrl.hivStatus).toEqual('hivStatus');

    });

  });

  describe('submit', function () {

    it('should call onSubmit binding', function () {

      var spy = jasmine.createSpy('onSubmit');
      var ctrl = $componentController('sexualPartnerForm', null, {onSubmit: spy});

      ctrl.submit({$valid: true});

      expect(spy).toHaveBeenCalled();

    });

    it('should set form submitted to false', function () {

      var spy = jasmine.createSpy('onSubmit');
      var ctrl = $componentController('sexualPartnerForm', null, {onSubmit: spy});

      var form = {$valid: true, $submitted: true};
      ctrl.submit(form);

      expect(form.$submitted).toEqual(false);

    });

  });

});
