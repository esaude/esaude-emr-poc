describe('SimilarPatientsController', function () {

  var $controller, $state, patientService;

  beforeEach(module('application'));

  beforeEach(inject(function (_$controller_, _$state_, _patientService_) {
    $controller = _$controller_;
    $state = _$state_;
    patientService = _patientService_;
  }));

  describe('refresh', function () {

    xit('should search for patients');

  });

  describe('loadPatientToDashboard', function () {

    /*it('should go to dashboard', function () {

      spyOn($state, 'go');

      var ctrl = $controller('SimilarPatientsController', {$scope: {}});

      ctrl.loadPatientToDashboard({});

      expect($state.go).toHaveBeenCalled();

    });*/

  });

});
