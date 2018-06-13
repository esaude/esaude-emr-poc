describe('recordAvailabilityValidator', function () {

  var $rootScope, $compile, $httpBackend, form;

  beforeEach(module('poc.common.clinicalservices'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$httpBackend_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $httpBackend = _$httpBackend_;
  }));

  beforeEach(function () {
    var $scope  = $rootScope.$new(true);
    var element = angular.element(
      '<form name="form">' +
      '<input ng-model="model.someval" name="someval" record-availability-validator="/some/endpoint/" />' +
      '</form>'
    );
    $scope.model = { someval: null };
    $compile(element)($scope);
    form = $scope.form;
  });

  describe('validation', function () {

    it('should do a GET to the given url', function () {

      $httpBackend.expectGET('/openmrs/some/endpoint/?q=val').respond({results: []});

      form.someval.$setViewValue('val');

      $rootScope.$apply();
    });

    it('should set validity to true if no results found', function () {

      $httpBackend.expectGET('/openmrs/some/endpoint/?q=val').respond({results: []});

      form.someval.$setViewValue('val');

      $rootScope.$apply();

      $httpBackend.flush();

      expect(form.someval.$valid).toBe(true);

    });

    it('should set validity to false if results found', function () {

      $httpBackend.expectGET('/openmrs/some/endpoint/?q=val').respond({results: [1,2,3,4]});

      form.someval.$setViewValue('val');

      $rootScope.$apply();

      $httpBackend.flush();

      expect(form.someval.$valid).toBe(false);

    });

  });

});
