describe("SimilarPatientsController", () => {

    var $controller, $rootScope, $location, controller, scope;

    var patient = { uuid: "UUID_1" };

    beforeEach(module("application"));

    beforeEach(inject((_$controller_, _$rootScope_, _$location_) => {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $location = _$location_;
    }));

    beforeEach(() => {
        scope = { patient: patient };

        spyOn($location, 'url');

        controller = $controller("SimilarPatientsController", { $scope: scope, patientService: {}, openmrsPatientMapper: {} });
        $rootScope.$apply();
    });

    describe("activate", () => {
        it("should set initial variables", () => {
            expect(controller.patient).toEqual(patient);
            expect(controller.similarPatients).toEqual([]);
        });
    });

    describe("loadPatientToDashboard", () => {

        it("should load dashboard", () => {
            expect(controller.patient).toEqual(patient);
            controller.loadPatientToDashboard();
            expect($rootScope.patient).toEqual(patient);
            expect($location.url).toHaveBeenCalled();
        });

    });

});
