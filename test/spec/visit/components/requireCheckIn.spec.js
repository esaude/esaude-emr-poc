describe('requireCheckIn', function () {

  var $componentController, $q, $rootScope, visitService;

  beforeEach(module('visit'));

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

      var ctrl = $componentController('requireCheckIn');

      ctrl.$onChanges({patient: {currentValue: {uuid: '39ada463-3040-49ac-b9ae-f5935efa6a2f'}}});

      expect(visitService.getTodaysVisit).toHaveBeenCalled();

    });

    it('should set flag indicating patient checked-in', function () {

      spyOn(visitService, 'getTodaysVisit').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });

      var ctrl = $componentController('requireCheckIn');

      ctrl.$onChanges({patient: {currentValue: {uuid: '39ada463-3040-49ac-b9ae-f5935efa6a2f'}}});

      $rootScope.$apply();

      expect(visitService.getTodaysVisit).toHaveBeenCalled();

    });

  });

});
