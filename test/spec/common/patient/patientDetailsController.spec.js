describe('DetailPatientController', function () {

  var controller, $controller, patientService;

   beforeEach(module('patient.details'));

   beforeEach(inject(function (_$controller, _patientService_) {
     $controller = _$controller;
     patientService = _patientService_;
   }));

  describe('activate', function () {

    xit('should load the patient');

    xit('should define the patient attributes');

  });

  describe('linkDashboard', function () {

    xit('should navigate to dashboard');

  });

  describe('print', function () {

    xit('should print the patient\'s daily hospital process');

  });

});
