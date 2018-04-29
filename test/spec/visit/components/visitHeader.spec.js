describe('VisitHeaderController', function () {

  var $componentController, $q, $rootScope, visitService;

  beforeEach(module('visit'));

  beforeEach(inject(function (_$componentController_, _$q_, _$rootScope_, _visitService_) {
    $q = _$q_;
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    visitService = _visitService_;
  }));

  var visitHeader = {
    lastVisit: {
      visitType: {
        name: "SEGUIMENTO SEGUINTE S. TARV"
      },
      startDatetime: "2018-03-19T09:47:18.000",
      stopDatetime: "2018-03-20T00:00:00.000"
    },
    lastPharmacy: {
      encounterDatetime: "2018-03-15T14:37:09.000",
      provider: {
        display: "Super User"
      }
    },
    nextPharmacy: {
      value: "2018-04-12T14:37:06.000"
    },
    lastBmi: {
      obsDatetime: "2017-11-13T00:00:00.000",
      value: 25.39
    },
    lastConsultation: {
      encounterDatetime: "2018-03-16T11:59:58.000",
      provider: {
        display: "Super User"
      }
    },
    nextConsultation: {
      value: "2018-03-19T00:00:00.000"
    }
  };

  describe('$onChanges', function () {

    beforeEach(function () {
      spyOn(visitService, 'getVisitHeader').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(visitHeader);
        });
      });
    });

    it('should set visit header properties', function () {

      var ctrl = $componentController('visitHeader');

      ctrl.$onChanges({patient: {currentValue: {age: 32}}});

      $rootScope.$apply();

      expect(ctrl).toEqual(jasmine.objectContaining(visitHeader));

    });

    it('should set flag for successful loading', function () {

      var ctrl = $componentController('visitHeader');

      ctrl.$onChanges({patient: {currentValue: {age: 32}}});

      $rootScope.$apply();

      expect(ctrl.loadFailed).toEqual(false);

    });

    it('should update the consultation message', function () {

      var ctrl = $componentController('visitHeader');

      ctrl.$onChanges({patient: {currentValue: {age: 32}}});

      $rootScope.$apply();

      expect(ctrl.lastConsultationMessage).toEqual('COMMON_LAST: 3/16/18 11:59 AM COMMON_BY: Super User | COMMON_NEXT: ');
      expect(ctrl.nextConsultationMessage).toEqual('3/19/18 12:00 AM');

    });

    it('should update the pharmacy message', function () {

      var ctrl = $componentController('visitHeader');

      ctrl.$onChanges({patient: {currentValue: {age: 32}}});

      $rootScope.$apply();

      expect(ctrl.lastPharmacyMessage).toEqual('COMMON_LAST: 3/15/18 2:37 PM COMMON_BY: Super User | COMMON_NEXT: ');
      expect(ctrl.nextPharmacyMessage).toEqual('4/12/18 2:37 PM');

    });

    it('should update the last visit message', function () {

      var ctrl = $componentController('visitHeader');

      ctrl.$onChanges({patient: {currentValue: {age: 32}}});

      $rootScope.$apply();

      expect(ctrl.lastVisitMessage).toEqual('SEGUIMENTO SEGUINTE S. TARV COMMON_FROM 19/03/2018 11:47 COMMON_TO 20/03/2018 02:00');

    });

  });

  describe('isInThePast', function () {

    it('should tell if given date is in the past', function () {

      var ctrl = $componentController('visitHeader');

      var is = ctrl.isInThePast(new Date(2010, 1, 1));

      expect(is).toBe(true);

    });

  });

  describe('loadVisitHeader', function () {

    beforeEach(function () {
      spyOn(visitService, 'getVisitHeader').and.callFake(function () {
        return $q(function (resolve) {
          return resolve(visitHeader);
        });
      });
    });

    it('should load the visit header', function () {

      var ctrl = $componentController('visitHeader');

      ctrl.$onChanges({patient: {currentValue: {age: 32}}});

      expect(visitService.getVisitHeader).toHaveBeenCalled();

    });

  });

});
