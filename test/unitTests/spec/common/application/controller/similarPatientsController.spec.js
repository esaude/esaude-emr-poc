describe("SimilarPatientsController", function () {

    var $controller, $rootScope, $location, controller, scope;

    var patient = { uuid: "UUID_1" };

    beforeEach(module("application"));

    beforeEach(inject(function (_$controller_, _$rootScope_, _$location_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $location = _$location_;
    }));

    beforeEach(function () {
        scope = { patient: patient };

        spyOn($location, 'url');

        controller = $controller("SimilarPatientsController", { $scope: scope, patientService: {}, openmrsPatientMapper: {} });
        $rootScope.$apply();
    });

    describe("activate", function () {
        it("should set initial variables", function () {
            expect(controller.patient).toEqual(patient);
            expect(controller.similarPatients).toEqual([]);
        });
    });

    describe("loadPatientToDashboard", function() {

        it("should load dashboard", function() {
            expect(controller.patient).toEqual(patient);
            controller.loadPatientToDashboard();
            expect($rootScope.patient).toEqual(patient);
            expect($location.url).toHaveBeenCalled();
        });

    });

});