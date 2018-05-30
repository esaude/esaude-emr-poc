describe("SimilarPatientsController", function () {

    var $controller, $rootScope, controller, scope;

    var patient = { uuid: "UUID_1" };

    beforeEach(module("application"));

    beforeEach(inject(function (_$controller_, _$rootScope_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
    }));

    beforeEach(function () {
        scope = { patient: patient };
        controller = $controller("SimilarPatientsController", { $scope: scope, patientService: {}, openmrsPatientMapper: {} });
        $rootScope.$apply();
    });

    describe("activate", function () {
        it("should set initial variables", function () {
            expect(controller.patient).toEqual(patient);
            expect(controller.similarPatients).toEqual([]);
        });
    });

});