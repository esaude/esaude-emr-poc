describe('patientHeaderController', function () {

  var $componentController, $q, $state, $uibModal;

  beforeEach(module('common.patient'));
  beforeEach(inject(function(_$componentController_, _$q_, _$state_, _$uibModal_) {
    $componentController = _$componentController_;
    $q = _$q_;
    $state = _$state_;
    $uibModal = _$uibModal_;
  }));


  describe('openPatientDeleteModal', function () {

    it('should open a modal', function () {

      spyOn($uibModal, 'open').and.callFake(function () {
        return {
          result: $q(function (resolve) {
            return resolve({});
          })
        };
      });

      var ctrl = $componentController('patientHeader');

      ctrl.openPatientDeleteModal();

      expect($uibModal.open).toHaveBeenCalled();

    });

  });

});
