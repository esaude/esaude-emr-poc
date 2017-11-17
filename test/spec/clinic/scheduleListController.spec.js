describe('PatientCommonController', function () {

  var scope, q, controller, observationsService, commonService;

  beforeEach(inject(function (_$controller_, _$rootScope_, _observationsService_, _commonService_)  {
      scope =  $rootScope.$new();
      controller = _$controller_;
      observationsService = _observationsService_;
      commonService = _commonService_;
  }));

  describe('init', function() {
      beforeEach(function () {
        spyOn(observationsService, 'getObs').and.callFake(function() {
            return $q(function (resolve) {

            });
        });

        it('should call the patient last consultations', function () {
            $rootScope.$apply();
            scope.getLastConsultationAndVisit();
            expect(observationsService.getObs).toHaveBeenCalled();
        });

      });
  });

});
