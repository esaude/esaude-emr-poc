describe('CheckInController', function () {

  var $componentController, $rootScope, visitService, notifier, $q;

  beforeEach(module('poc.common.visit'));

  beforeEach(inject(function (_$componentController_, _visitService_, _$rootScope_, _$q_, _notifier_) {
    $componentController = _$componentController_;
    visitService = _visitService_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    notifier = _notifier_;
  }));

  beforeEach(function () {

  });

  describe('$onChanges', function () {

    it('should load visit for today', function () {
      var visit = { patient: { uuid: '7401f469-60ee-4cfa-afab-c1e89e2944e4' } };
      spyOn(visitService, 'getTodaysVisit').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(visit);
        });
      });
      var ctrl = $componentController('checkIn');
      ctrl.$onChanges({ patient: { currentValue: { uuid: '7401f469-60ee-4cfa-afab-c1e89e2944e4' } } });
      $rootScope.$apply();
      expect(ctrl.todayVisit).toEqual(visit);
    });
  });

  describe('checkIn', function () {

    it('should check-in the patient', function () {

      var visit = {};

      spyOn(visitService, 'checkInPatient').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(visit);
        });
      });

      var ctrl = $componentController('checkIn');

      ctrl.checkIn();

      expect(visitService.checkInPatient).toHaveBeenCalled();

    });

    it('should update the day\'s visit', function () {

      var visit = {};

      spyOn(visitService, 'checkInPatient').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(visit);
        });
      });

      var ctrl = $componentController('checkIn', null, {
        onCheckInChange: function () {
        }
      });

      ctrl.checkIn();
      $rootScope.$apply();

      expect(ctrl.todayVisit).toEqual(visit);

    });

    it('should call onCheckInChange binding', function () {

      var visit = {};

      spyOn(visitService, 'checkInPatient').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(visit);
        });
      });

      var ctrl = $componentController('checkIn', null, {onCheckInChange: jasmine.createSpy('onCheckInChange')});

      ctrl.checkIn();
      $rootScope.$apply();

      expect(ctrl.onCheckInChange).toHaveBeenCalled();

    });

  });

  describe('cancelCheckIn', function () {

    it('should check-in the patient', function () {

      var visit = {};

      spyOn(visitService, 'deleteVisit').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(visit);
        });
      });

      var ctrl = $componentController('checkIn');

      ctrl.cancelCheckIn();

      expect(visitService.deleteVisit).toHaveBeenCalled();

    });

    it('should update the day\'s visit', function () {

      var visit = {};

      spyOn(visitService, 'deleteVisit').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(visit);
        });
      });

      var ctrl = $componentController('checkIn', null, {
        onCheckInChange: function () {
        }
      });

      ctrl.cancelCheckIn();
      $rootScope.$apply();

      expect(ctrl.todayVisit).toEqual(null);

    });

    it('should call onCheckInChange binding', function () {

      var visit = {};

      spyOn(visitService, 'deleteVisit').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(visit);
        });
      });

      var ctrl = $componentController('checkIn', null, {onCheckInChange: jasmine.createSpy('onCheckInChange')});

      ctrl.cancelCheckIn();
      $rootScope.$apply();

      expect(ctrl.onCheckInChange).toHaveBeenCalled();

    });

  });

});
