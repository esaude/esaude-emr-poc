'use strict';

// TODO @larslemos
xdescribe('PatientSimplifiedPrescriptionController', function () {

  var $controller;

  beforeEach(module('clinic'));

  beforeEach(inject(function (_$controller_) {
    $controller = _$controller_;
  }));

  describe('When canceling new prescription', function () {

    it('should remove all added drugs', function () {
      var $scope = {
        existingPrescriptions: []
      };

      var ctrl = $controller('PatientSimplifiedPrescriptionController', {
        $scope: $scope
      });

      spyOn(ctrl, "init").andCallFake(function () {
        $scope.existingPrescriptions.push(1);
        $scope.existingPrescriptions.push(2);
      });

      $scope.removeAll();

      expect($scope.existingPrescriptions.length).toBe(0);
    });

    it('should hide controls', function () {
      fail('TODO');
    });

  });
});
