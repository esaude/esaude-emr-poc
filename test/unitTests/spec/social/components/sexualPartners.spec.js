describe('SexualPartnersController', () => {

  var $componentController, $q, $rootScope, sexualPartnersService, visitService;

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

  beforeEach(inject((_$componentController_, _$q_, _$rootScope_, _sexualPartnersService_, _visitService_) => {

    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    sexualPartnersService = _sexualPartnersService_;
    visitService = _visitService_;
  }));

  describe('$onInit', () => {

    beforeEach(() => {

      spyOn(sexualPartnersService, 'getSexualPartners').and.callFake(() => $q(resolve => resolve([1, 2, 3])));

      spyOn(visitService, 'getTodaysVisit').and.callFake(() => $q(resolve => resolve({})));

    });

    it('should load sexual partners', () => {

      var ctrl = $componentController('sexualPartners', null, {patient: {uuid: 'uuid', age: {years: 27}}});

      ctrl.$onInit();

      $rootScope.$apply();

      expect(ctrl.partners).toEqual([1,2,3]);

    });

  });

  describe('addAnother', () => {

    it('should set flag for displaying sexual partners form', () => {

      var ctrl = $componentController('sexualPartners');

      expect(ctrl.add).toBeFalsy();

      ctrl.addAnother();

      expect(ctrl.add).toEqual(true);

    });

  });

  describe('removePartner', () => {

    it('should delete sexual partner', () => {

      spyOn(sexualPartnersService, 'removeSexualPartner').and.callFake(() => $q(resolve => resolve()));

      var ctrl = $componentController('sexualPartners');

      ctrl.removePartner();

      expect(sexualPartnersService.removeSexualPartner).toHaveBeenCalled();

    });

    it('should remove sexual partner from list', () => {

      spyOn(sexualPartnersService, 'removeSexualPartner').and.callFake(() => $q(resolve => resolve()));

      var ctrl = $componentController('sexualPartners');

      ctrl.partners = [1];

      ctrl.removePartner(1);

      $rootScope.$apply();

      expect(ctrl.partners).toEqual([]);

    });

  });

  describe('savePartner', () => {

    it('should save sexual partner', () => {

      spyOn(sexualPartnersService, 'saveSexualPartner').and.callFake(() => $q(resolve => resolve({})));

      var ctrl = $componentController('sexualPartners');

      ctrl.savePartner({});

      expect(sexualPartnersService.saveSexualPartner).toHaveBeenCalled();

    });

    it('should create newPartner object', () => {

      spyOn(sexualPartnersService, 'saveSexualPartner').and.callFake(() => $q(resolve => resolve({})));

      var ctrl = $componentController('sexualPartners');

      ctrl.newPartner = {name: 'Malocy'};

      ctrl.savePartner({});

      $rootScope.$apply();
      expect(ctrl.newPartner).toEqual({});

    });

    it('should add sexual partner to list', () => {

      spyOn(sexualPartnersService, 'saveSexualPartner').and.callFake(() => $q(resolve => resolve({name: 'Malocy'})));

      var ctrl = $componentController('sexualPartners');

      ctrl.partners = [];

      ctrl.savePartner({name: 'Malocy'});

      $rootScope.$apply();
      expect(ctrl.partners).toContain({name: 'Malocy'});

    });

    it('should remove flag for displaying sexual partners form', () => {

      spyOn(sexualPartnersService, 'saveSexualPartner').and.callFake(() => $q(resolve => resolve({name: 'Malocy'})));

      var ctrl = $componentController('sexualPartners');

      ctrl.add = true;

      ctrl.savePartner({name: 'Malocy'});

      $rootScope.$apply();
      expect(ctrl.add).toEqual(false);

    });

  });

});
