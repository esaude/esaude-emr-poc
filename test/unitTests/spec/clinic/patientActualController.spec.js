describe("PatientActualController", function () {

    var $controller, $rootScope, scope;

    beforeEach(module('clinic', function ($provide, $translateProvider, $urlRouterProvider) {
        $provide.factory('mergeLocaleFilesService', function ($q) {
            return function () {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            };
        });
        $translateProvider.useLoader('mergeLocaleFilesService');
        $urlRouterProvider.deferIntercept();
    }));

    beforeEach(inject(function (_$controller_, _$rootScope_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
    }));

    beforeEach(function () {
        scope = {};
        controller = $controller('PatientActualController', {
            $scope: scope
        });
        $rootScope.$apply();
    });

    describe("activate()", function () {
        it("should do something usefull", function () {
            expect(scope.initMaxLabResults).not.toBe(null);
        });
    });

});