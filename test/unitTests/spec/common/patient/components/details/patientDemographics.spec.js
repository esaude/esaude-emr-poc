describe('patientDemographics', function () {

  var $componentController, patientService, $q, $rootScope;

  beforeEach(module('common.patient'));

  beforeEach(inject(function (_$componentController_, _patientService_, _$q_, _$rootScope_) {
    $componentController = _$componentController_;
    patientService = _patientService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('$onInit', function () {

    var personAttributes = [{name: "Alcunha", uuid: "d82b0cf4-26cc-11e8-bdc0-2b5ea141f82e"}];

    it('should get person attributes for name step', function () {

      spyOn(patientService, 'getPersonAttributesForStep').and.callFake(function () {
        return personAttributes;
      });

      var ctrl = $componentController('patientDemographics');

      ctrl.$onInit();

      expect(patientService.getPersonAttributesForStep).toHaveBeenCalledWith('name');

    });

  });

});
