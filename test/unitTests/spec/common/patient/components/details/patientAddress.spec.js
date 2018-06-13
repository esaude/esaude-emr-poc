describe('patientAddress', function () {

  var $componentController, configurationService, $q, $rootScope;

  beforeEach(module('common.patient'));

  beforeEach(inject(function (_$componentController_, _configurationService_, _$q_, _$rootScope_) {
    $componentController = _$componentController_;
    configurationService = _configurationService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('$onInit', function () {

    var addressLevels = [
      {name: "Pais", addressField: "country", required: true},
      {name: "Provincia", addressField: "stateProvince", required: true},
    ];

    it('should get address levels', function () {

      spyOn(configurationService, 'getAddressLevels').and.callFake(function () {
        return $q.resolve(addressLevels);
      });

      var ctrl = $componentController('patientAddress');

      ctrl.$onInit();

      $rootScope.$apply();

      expect(ctrl.addressLevels).toEqual(addressLevels);

    });

  });

});
