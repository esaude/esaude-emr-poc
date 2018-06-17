describe('formField', function () {

  var $componentController, $q, $rootScope, conceptService;

  beforeEach(module('poc.common.clinicalservices'));

  beforeEach(inject(function (_$componentController_, _$q_, _$rootScope_, _conceptService_) {
    $componentController = _$componentController_;
    $q = _$q_;
    $rootScope = _$rootScope_;
    conceptService = _conceptService_;
  }));

  describe('$onInit', function () {

    it('$watch if formWizard submitted', function () {

      var formParts = {};
      var $scope = $rootScope.$new(true);
      $scope.$watch = jasmine.createSpy('$watch');
      var ctrl = $componentController('formField', {$scope: $scope}, {field: {id: 1}, formParts: formParts, fieldUuid: '1234', fieldId: 2});
      var addVisitedField = jasmine.createSpy('addVisitedField');
      ctrl.formWizard = {addVisitedField: addVisitedField};

      ctrl.$onInit();

      expect($scope.$watch).toHaveBeenCalledWith('vm.formWizard.submitted', jasmine.anything());

    });

    it('$watch field validity', function () {

      var formParts = {};
      var $scope = $rootScope.$new(true);
      $scope.$watch = jasmine.createSpy('$watch');
      var ctrl = $componentController('formField', {$scope: $scope}, {field: {id: 1}, formParts: formParts, fieldUuid: '1234', fieldId: 2});
      var addVisitedField = jasmine.createSpy('addVisitedField');
      ctrl.formWizard = {addVisitedField: addVisitedField};

      ctrl.$onInit();

      expect($scope.$watch).toHaveBeenCalledWith('aForm.2.$valid', jasmine.anything());

    });

    it('$watch formParts', function () {

      var formParts = {};
      var $scope = $rootScope.$new(true);
      $scope.$watch = jasmine.createSpy('$watch');
      var ctrl = $componentController('formField', {$scope: $scope}, {field: {id: 1}, formParts: formParts, fieldUuid: '1234', fieldId: 2});
      var addVisitedField = jasmine.createSpy('addVisitedField');
      ctrl.formWizard = {addVisitedField: addVisitedField};

      ctrl.$onInit();

      expect($scope.$watch).toHaveBeenCalledWith('vm.formParts', jasmine.anything());

    });

  });

  describe('onBlurSearchBySource', function () {

    describe('no results found', function () {

      it('should reset model value', function () {

        var formParts = {};
        var ctrl = $componentController('formField', {$scope: $rootScope.$new(true)}, {field: {id: 1}, formParts: formParts, fieldUuid: '1234'});
        ctrl.formWizard = {addVisitedField: jasmine.createSpy('addVisitedField')};
        ctrl.$onInit();
        ctrl.formParts = {form: {fields: {'1234': {field: {uuid: '1234'}, value: 1234}}}};
        ctrl.typeahead.noResults = true;
        $rootScope.$apply();

        ctrl.onBlurSearchBySource();

        expect(ctrl.fieldModel.value).toBeNull();

      });

      it('should reset no results flag', function () {

        var formParts = {};
        var ctrl = $componentController('formField', {$scope: $rootScope.$new(true)}, {field: {id: 1}, formParts: formParts, fieldUuid: '1234'});
        ctrl.formWizard = {addVisitedField: jasmine.createSpy('addVisitedField')};
        ctrl.$onInit();
        ctrl.formParts = {form: {fields: {'1234': {field: {uuid: '1234'}, value: 1234}}}};
        ctrl.typeahead.noResults = true;
        $rootScope.$apply();

        ctrl.onBlurSearchBySource();

        expect(ctrl.typeahead.noResults).toEqual(false);

      });

    });

  });

  describe('searchBySource', function () {

    it('should search for concepts by concept source', function () {

      spyOn(conceptService, 'searchBySource').and.callFake(function () {
        return $q(function (resolve) {
          return resolve([]);
        });
      });

      var formParts = {};
      var ctrl = $componentController('formField', {$scope: $rootScope.$new(true)}, {field: {id: 1}, formParts: formParts, fieldUuid: '1234'});

      ctrl.searchBySource('Malár');

      expect(conceptService.searchBySource).toHaveBeenCalled();

    });

    it('should filter search result values', function () {

      spyOn(conceptService, 'searchBySource').and.callFake(function () {
        return $q(function (resolve) {
          return resolve([{display: 'Malária falciparum congênita'}, {display: 'Operador de Máquina de Colar Peles para Malas e Marroquinaria'}]);
        });
      });

      var formParts = {};
      var ctrl = $componentController('formField', {$scope: $rootScope.$new(true)}, {field: {id: 1}, formParts: formParts, fieldUuid: '1234'});

      var results;
      ctrl.searchBySource('Malár').then(function (concepts) {
        results = concepts;
      });

      $rootScope.$apply();

      expect(results.length).toBe(1);
      expect(results).toContain({display: 'Malária falciparum congênita'});

    });

  });

});
