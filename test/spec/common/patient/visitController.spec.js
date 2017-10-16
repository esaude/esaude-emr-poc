describe('VisitController', function () {

  var $controller, $rootScope, visitService, encounterService,
    localStorageService, patientService, notifier, controller, $q, observationsService;

  var visits = [];

  beforeEach(module('common.patient'));

  beforeEach(inject(function (_$controller_, _localStorageService_, _visitService_, _$rootScope_, _patientService_,
                              _encounterService_, _$q_, _notifier_, _observationsService_) {
    $controller = _$controller_;
    localStorageService = _localStorageService_;
    visitService = _visitService_;
    $rootScope = _$rootScope_;
    patientService = _patientService_;
    encounterService = _encounterService_;
    $q = _$q_;
    notifier = _notifier_;
    observationsService = _observationsService_;
  }));

  beforeEach(function () {
    spyOn(visitService, 'search').and.callFake(function () {
      return $q(function (resolve) {
        return resolve(visits);
      });
    });
    spyOn(patientService, 'getPatient').and.callFake(function () {
      return $q(function (resolve) {
        return resolve({age: {years: 16}});
      });
    });
    spyOn(encounterService, 'getEncountersForEncounterType').and.returnValue({
      success: function (fn) {
        return fn([]);
      }
    });
    spyOn(observationsService, 'getLastPatientObs').and.callFake(function () {
      return $q(function (resolve) {
        return resolve();
      })
    });


  });

  describe('checkIn', function () {

    beforeEach(function () {

      $rootScope.defaultVisitTypes = [
        {occurOn: 'first', uuid: '64a510a1-fbf4-465f-acd2-cd37bc321cee'},
        {occurOn: 'following', uuid: '3866891d-09c5-4d98-98de-6ae7916110fa'}
      ];

      $rootScope.encounterTypes = {
        followUpAdult: '',
        followUpChild: ''
      };

      localStorageService.cookie = {
        get: function () {
          return {uuid: 'uuid'};
        }
      };

      spyOn(visitService, 'create').and.callFake(function () {
        return $q(function (resolve) {
          return resolve({});
        });
      });
    });

    describe('first visit', function () {

      it('should create a visit with first consultation type', function () {

        controller = $controller('VisitController', {
          $rootScope: $rootScope,
          localStorageService: localStorageService,
          visitService: visitService,
          patientService: patientService,
          encounterService: encounterService
        });

        $rootScope. $apply();
        controller.checkIn();

        expect(visitService.create)
          .toHaveBeenCalledWith(jasmine.objectContaining({visitType: $rootScope.defaultVisitTypes[0].uuid}));
      });
    });

    describe('follow-up visit', function () {

      beforeEach(function () {
        visits = [{voided: false}];
      });

      it('should create a visit with follow-up consultation type', function () {

        controller = $controller('VisitController', {
          $rootScope: $rootScope,
          localStorageService: localStorageService,
          visitService: visitService,
          patientService: patientService,
          encounterService: encounterService
        });

        $rootScope.$apply();
        controller.checkIn();

        expect(visitService.create)
          .toHaveBeenCalledWith(jasmine.objectContaining({visitType: $rootScope.defaultVisitTypes[1].uuid}));

      });
    });

    describe('missing emr.location', function () {

      beforeEach(function () {
        localStorageService.cookie = {
          get: function () {
            return null;
          }
        };

        spyOn(notifier, 'error').and.callFake(function () {

        });

      });


      it('should not create a visit', function () {

        controller = $controller('VisitController', {
          $rootScope: $rootScope,
          localStorageService: localStorageService,
          visitService: visitService,
          patientService: patientService,
          encounterService: encounterService
        });

        $rootScope.$apply();
        controller.checkIn();

        expect(visitService.create).not.toHaveBeenCalled();
        expect(notifier.error).toHaveBeenCalled();
      });
    });
  });

});
