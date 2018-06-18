describe('patientOther', () => {

  var $componentController, patientService, $q, $rootScope;

  beforeEach(module('common.patient'));

  beforeEach(inject((_$componentController_, _patientService_, _$q_, _$rootScope_) => {
    $componentController = _$componentController_;
    patientService = _patientService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('$onInit', () => {

    var personAttributes = [{name: "Alcunha", uuid: "d82b0cf4-26cc-11e8-bdc0-2b5ea141f82e"}];

    it('should get person attributes for other step', () => {

      spyOn(patientService, 'getPersonAttributesForStep').and.callFake(() => personAttributes);

      var ctrl = $componentController('patientOther');

      ctrl.$onInit();

      expect(patientService.getPersonAttributesForStep).toHaveBeenCalledWith('other');

    });

  });

});
