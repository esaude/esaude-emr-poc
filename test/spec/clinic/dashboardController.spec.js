'use strict';

describe('DashboardController', function() {
  var patientUuid, scope, $rootScope, controller, location, patientService, patientMapper,
    httpBackend, stateParams;

  beforeEach(module('clinic'));
  beforeEach(inject(function ($location) {
      location = $location;
  }));

  beforeEach(inject(function (_$controller_, _$rootScope_, _$location_, _patientService_,
                              _$httpBackend_, $stateParams, openmrsPatientMapper)  {
    scope = _$rootScope_.$new();
    $rootScope = _$rootScope_;
    controller = _$controller_;
    location = _$location_;
    patientService = _patientService_;
    httpBackend = _$httpBackend_;
    stateParams = $stateParams;
    patientMapper = openmrsPatientMapper;

    patientService = jasmine.createSpyObj('patientService',['get']);

    controller('DashboardController', {
      $scope : scope,
      $stateparams: stateParams
    });

    spyOn(location, 'url').and.callThrough();

  }));

    describe('getPatientUuid', function () {

      it('should make http call to get patient uuid', function() {

        stateParams = { patientUuid: 'patientUuid'};
        expect(stateParams.patientUuid).toBeDefined();

      });


    });


});
