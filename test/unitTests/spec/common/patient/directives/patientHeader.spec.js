describe('patientHeaderController', () => {

  var $componentController, $q, $state, $uibModal;

  beforeEach(module('common.patient'));
  beforeEach(inject((_$componentController_, _$q_, _$state_, _$uibModal_) => {
    $componentController = _$componentController_;
    $q = _$q_;
    $state = _$state_;
    $uibModal = _$uibModal_;
  }));


  describe('openPatientDeleteModal', () => {

    it('should open a modal', () => {

      spyOn($uibModal, 'open').and.callFake(() => ({
        result: $q(resolve => resolve({}))
      }));

      var ctrl = $componentController('patientHeader');

      ctrl.openPatientDeleteModal();

      expect($uibModal.open).toHaveBeenCalled();

    });

  });

});
