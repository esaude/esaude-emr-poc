'use strict';

describe('SearchController', function () {

  var controller, $httpBackend, scope, patientResource, patientMapper,
    searchPromise, spinner, observationsService, commonService ;

  beforeEach(module('application'));

  beforeEach(function () {
    inject(function ($rootScope, $controller, _$httpBackend_ ) {
      scope = $rootScope.$new();
      controller =  $controller;
      $httpBackend = _$httpBackend_;

      patientResource = jasmine.createSpyObj('patientService', ['search']);
      searchPromise = specUtil.createServicePromise('search');
      patientResource.search.and.returnValue(searchPromise);
      spinner = jasmine.createSpyObj('spinner', ['show', 'hide', 'forPromise']);

      controller('SearchController', {
        $scope: scope,
        spinner: spinner,
        patientService: patientResource,
        openmrsPatientMapper:  patientMapper,
        observationsService: observationsService,
        commonService: commonService
      });
    });
  });

  describe('On changing the search parameter in URL ', function () {

    it("should load data at 3 chars", function() {
      patientResource.search();

      expect(patientResource.search).toHaveBeenCalled();
      expect(searchPromise).toBeDefined();

      expect(scope.results).toBeDefined();
    });

    it("should set the search results ", function () {


      //expect(searchPromise.success).toHaveBeenCalled();

    });

  });
});
