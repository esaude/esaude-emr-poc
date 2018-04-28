'use strict';
describe('FormFieldDirectiveController', function () {

  var $controller, $q, $rootScope, controller;

  var $window = { location: { pathname: '', href: '' } };

  var scope;

  var VALID_CODED_VALUE = { display: "FIELD_0" };
  var VALID_CODED_FIELD_MODEL = { value: VALID_CODED_VALUE };

  beforeEach(module('poc.common.clinicalservices'));
  beforeEach(module('poc.common.clinicalservices.formdisplay', function ($provide) {
    $provide.value('$window', $window);
  }));

  beforeEach(inject(function (_$controller_, _$q_, _$rootScope_) {
    $controller = _$controller_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(function () {
    scope = {
      field: { id: "UUID1" },
      $watch: function () { },
      fieldModel: { value: "TEXTO_INVALIDO" }
    };

    controller = $controller('FormFieldDirectiveController', {
      $scope: scope
    });
  });

  describe('clearValueIfInvalid', function () {

    it('should clear value when display property is not present', function () {
      scope.clearValueIfInvalid();
      expect(scope.fieldModel.value).toBeNull();
    });

    it('should not clear value when display property is present', function () {
      scope.fieldModel = VALID_CODED_FIELD_MODEL;
      scope.clearValueIfInvalid();
      expect(scope.fieldModel.value).toEqual(VALID_CODED_VALUE);
    });

  });

});
