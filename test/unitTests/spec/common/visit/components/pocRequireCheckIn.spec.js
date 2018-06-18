describe('pocRequireCheckIn', () => {

  var $componentController, $q, $rootScope, visitService;

  beforeEach(module('poc.common.visit'));

  beforeEach(inject((_$componentController_, _$q_, _$rootScope_, _visitService_) => {
    $q = _$q_;
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    visitService = _visitService_;
  }));

  describe('$onChanges', () => {

    it('should load patients current visit', () => {

      spyOn(visitService, 'getTodaysVisit').and.callFake(() => $q(resolve => resolve({})));

      var ctrl = $componentController('pocRequireCheckIn');

      ctrl.$onChanges({patient: {currentValue: {uuid: '39ada463-3040-49ac-b9ae-f5935efa6a2f'}}});

      expect(visitService.getTodaysVisit).toHaveBeenCalled();

    });

    it('should set flag indicating patient checked-in', () => {

      spyOn(visitService, 'getTodaysVisit').and.callFake(() => $q(resolve => resolve({})));

      var ctrl = $componentController('pocRequireCheckIn');

      ctrl.$onChanges({patient: {currentValue: {uuid: '39ada463-3040-49ac-b9ae-f5935efa6a2f'}}});

      ctrl.checkedIn = false;

      $rootScope.$apply();

      expect(ctrl.checkedIn).toEqual(true);

    });

  });


  describe('$onInit', () => {

    it('should not set show messages if no message is provided', () => {

      var ctrl = $componentController('pocRequireCheckIn');

      ctrl.$onInit();

      expect(ctrl.showMessage).not.toBeDefined();

    });

    it('should set show messages if message is provided', () => {

      var ctrl = $componentController('pocRequireCheckIn', null, {message: 'PLEASE_CHECK_IN'});

      ctrl.$onInit();

      expect(ctrl.showMessage).toEqual(true);

    });

  });

});
