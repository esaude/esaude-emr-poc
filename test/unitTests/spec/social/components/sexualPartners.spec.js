describe('SexualPartnersController', function () {

  var $componentController, $q, $rootScope, sexualPartnersService, visitService;

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

  beforeEach(inject(function (_$componentController_, _$q_, _$rootScope_, _sexualPartnersService_, _visitService_) {

    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    sexualPartnersService = _sexualPartnersService_;
    visitService = _visitService_;
  }));

  describe('$onInit', function () {

    beforeEach(function () {

      spyOn(sexualPartnersService, 'getSexualPartners').and.callFake(function () {
        return $q(function (resolve) {
          return resolve([1,2,3]);
        });
      });

      spyOn(visitService, 'getTodaysVisit').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

    });

    it('should load sexual partners', function () {

      var ctrl = $componentController('sexualPartners', null, {patient: {uuid: 'uuid', age: {years: 27}}});

      ctrl.$onInit();

      $rootScope.$apply();

      expect(ctrl.partners).toEqual([1,2,3]);

    });

  });

  describe('addAnother', function () {

    it('should set flag for displaying sexual partners form', function () {

      var ctrl = $componentController('sexualPartners');

      expect(ctrl.add).toBeFalsy();

      ctrl.addAnother();

      expect(ctrl.add).toEqual(true);

    });

  });

  describe('removePartner', function () {

    it('should delete sexual partner', function () {

      spyOn(sexualPartnersService, 'removeSexualPartner').and.callFake(function () {
        return $q(function (resolve) {
          return resolve();
        });
      });

      var ctrl = $componentController('sexualPartners');

      ctrl.removePartner();

      expect(sexualPartnersService.removeSexualPartner).toHaveBeenCalled();

    });

    it('should remove sexual partner from list', function () {

      spyOn(sexualPartnersService, 'removeSexualPartner').and.callFake(function () {
        return $q(function (resolve) {
          return resolve();
        });
      });

      var ctrl = $componentController('sexualPartners');

      ctrl.partners = [1];

      ctrl.removePartner(1);

      $rootScope.$apply();

      expect(ctrl.partners).toEqual([]);

    });

  });

  describe('savePartner', function () {

    it('should save sexual partner', function () {

      spyOn(sexualPartnersService, 'saveSexualPartner').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      var ctrl = $componentController('sexualPartners');

      ctrl.savePartner({});

      expect(sexualPartnersService.saveSexualPartner).toHaveBeenCalled();

    });

    it('should create newPartner object', function () {

      spyOn(sexualPartnersService, 'saveSexualPartner').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      var ctrl = $componentController('sexualPartners');

      ctrl.newPartner = {name: 'Malocy'};

      ctrl.savePartner({});

      $rootScope.$apply();
      expect(ctrl.newPartner).toEqual({});

    });

    it('should add sexual partner to list', function () {

      spyOn(sexualPartnersService, 'saveSexualPartner').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({name: 'Malocy'});
        });
      });

      var ctrl = $componentController('sexualPartners');

      ctrl.partners = [];

      ctrl.savePartner({name: 'Malocy'});

      $rootScope.$apply();
      expect(ctrl.partners).toContain({name: 'Malocy'});

    });

    it('should remove flag for displaying sexual partners form', function () {

      spyOn(sexualPartnersService, 'saveSexualPartner').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({name: 'Malocy'});
        });
      });

      var ctrl = $componentController('sexualPartners');

      ctrl.add = true;

      ctrl.savePartner({name: 'Malocy'});

      $rootScope.$apply();
      expect(ctrl.add).toEqual(false);

    });

  });

});
