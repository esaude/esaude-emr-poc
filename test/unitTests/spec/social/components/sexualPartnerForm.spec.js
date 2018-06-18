describe('SexualPartnerFormController', () => {

  var $componentController, $q, $rootScope, sexualPartnersService;

  beforeEach(module('social', ($provide, $translateProvider, $urlRouterProvider) => {
    // Mock translate asynchronous loader
    $provide.factory('mergeLocaleFilesService', $q => () => {
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject((_$componentController_, _$q_, _$rootScope_, _sexualPartnersService_) => {

    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    sexualPartnersService = _sexualPartnersService_;
  }));

  describe('$onInit', () => {

    it('should load form data', () => {

      spyOn(sexualPartnersService, 'getFormData').and.callFake(() => $q(resolve => resolve({
        relationshipToPatient: 'relationshipToPatient',
        hivStatus: 'hivStatus'
      })));

      var ctrl = $componentController('sexualPartnerForm');

      ctrl.$onInit();

      $rootScope.$apply();

      expect(ctrl.relationshipToPatient).toEqual('relationshipToPatient');
      expect(ctrl.hivStatus).toEqual('hivStatus');

    });

  });

  describe('submit', () => {

    it('should call onSubmit binding', () => {

      var spy = jasmine.createSpy('onSubmit');
      var ctrl = $componentController('sexualPartnerForm', null, {onSubmit: spy});

      ctrl.submit({$valid: true});

      expect(spy).toHaveBeenCalled();

    });

    it('should set form submitted to false', () => {

      var spy = jasmine.createSpy('onSubmit');
      var ctrl = $componentController('sexualPartnerForm', null, {onSubmit: spy});

      var form = {$valid: true, $submitted: true};
      ctrl.submit(form);

      expect(form.$submitted).toEqual(false);

    });

  });

});
