describe('drugAvailabilityValidator', () => {

  var $scope, form, drugService, $q, $compile;
  var element = angular.element(
    '<form name="form">' +
      '<input ng-model="model.drug" name="drug" drug-availability-validator />' +
    '</form>'
  );

  beforeEach(module('common.prescription'));

  beforeEach(inject((_$compile_, $rootScope, _drugService_, _$q_) => {
    $q = _$q_;
    drugService = _drugService_;
    $scope = $rootScope;
    $compile =_$compile_;
  }));

  describe('validate', () => {

    it('should pass with empty model value', () => {
      $scope.model = {drug: null};
      $compile(element)($scope);
      form = $scope.form;
      form.drug.$modelValue = null;
      $scope.$digest();
      expect(form.drug.$valid).toBe(true);
    });

    it('should pass if drug is available', () => {
      $scope.model = {drug: {uuid: "7461fed0-e6a4-4e4b-ab28-1af3eb2037fe"}};
      $compile(element)($scope);
      form = $scope.form;
      spyOn(drugService, 'isDrugAvailable').and.returnValue($q.resolve(true));
      $scope.$digest();
      expect(form.drug.$valid).toBe(true);
    });

    it('should not pass if drug is not available', () => {
      $scope.model = {drug: {uuid: "7461fed0-e6a4-4e4b-ab28-1af3eb2037fe"}};
      $compile(element)($scope);
      form = $scope.form;
      spyOn(drugService, 'isDrugAvailable').and.returnValue($q.resolve(false));
      $scope.$digest();
      expect(form.drug.$valid).toBe(false);
    });

  });
});
