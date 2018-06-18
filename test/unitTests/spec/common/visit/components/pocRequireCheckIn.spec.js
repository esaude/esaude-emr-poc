describe('pocRequireCheckIn', function () {

  var $componentController, $q, $rootScope, visitService;

  beforeEach(module('poc.common.visit'));

  beforeEach(inject(function (_$componentController_, _$q_, _$rootScope_, _visitService_) {
    $q = _$q_;
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    visitService = _visitService_;
  }));

  describe('$onChanges', function () {

    it('should load patients current visit', function () {

      spyOn(visitService, 'getTodaysVisit').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      var ctrl = $componentController('pocRequireCheckIn');

      ctrl.$onChanges({patient: {currentValue: {uuid: '39ada463-3040-49ac-b9ae-f5935efa6a2f'}}});

      expect(visitService.getTodaysVisit).toHaveBeenCalled();

    });

    it('should set flag indicating patient checked-in', function () {

      spyOn(visitService, 'getTodaysVisit').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      var ctrl = $componentController('pocRequireCheckIn');

      ctrl.$onChanges({patient: {currentValue: {uuid: '39ada463-3040-49ac-b9ae-f5935efa6a2f'}}});

      ctrl.checkedIn = false;

      $rootScope.$apply();

      expect(ctrl.checkedIn).toEqual(true);

    });

  });


  describe('$onInit', function () {

    it('should not set show messages if no message is provided', function () {

      var ctrl = $componentController('pocRequireCheckIn');

      ctrl.$onInit();

      expect(ctrl.showMessage).not.toBeDefined();

    });

    it('should set show messages if message is provided', function () {

      var ctrl = $componentController('pocRequireCheckIn', null, {message: 'PLEASE_CHECK_IN'});

      ctrl.$onInit();

      expect(ctrl.showMessage).toEqual(true);

    });

  });

});
