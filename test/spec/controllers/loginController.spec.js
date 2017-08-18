describe('Controller: LoginController', function () {
    var scope, q, controller, location, sessionService, stateParams, mockLocaleService, $httpBackend, $window;

    beforeEach(module('home'));

    beforeEach(function () {
        // mock $window
        $window = {
            location: {
                reload: jasmine.createSpy()
            }
        };

        module(function ($provide) {
            $provide.value('$window', $window);
        });
    });

    beforeEach(inject(function ($controller, $rootScope, _$location_, _sessionService_, $q, $stateParams, localeService, _$httpBackend_) {
        scope = $rootScope.$new();
        q = $q;
        location = _$location_;
        controller = $controller;
        stateParams = $stateParams;
        sessionService = _sessionService_;
        mockLocaleService = localeService;
        $httpBackend = _$httpBackend_;

        // mock sessionService.loginUser
        spyOn(sessionService, 'loginUser').and.callFake(function (testUser) {
            var defer = $q.defer();

            if (testUser === 'testSuccessUser') {
                defer.resolve();
            } else {
                defer.reject('invalid username or password');
            }

            return defer.promise;
        });

        // mock sessionService.getSession
        spyOn(sessionService, 'getSession').and.callFake(function () {
            return {
                then: function (callback) {
                    var data = {};
                    data.authenticated = false;
                    callback(data);
                }
            };
        });

        // mock localService
        spyOn(mockLocaleService, 'allowedLocalesList').and.callFake(function () {
            var defer = $q.defer();

            defer.resolve({
                data: 'en, es, fr, it, pt'
            });

            return defer.promise;
        });

        location.path('/login');
        spyOn(location, 'path').and.callThrough();
    }));

    it('should redirect the user to the landing page on successful login', function () {
        // construct controller
        var ctrl = controller('LoginController', {
            $scope: scope,
            $location: location,
            sessionService: sessionService
        });

        // mock sessionService.loadCredentials (success)
        spyOn(sessionService, 'loadCredentials').and.returnValue(q.when({}));

        scope.loginUser = {
            username: 'testSuccessUser',
            password: 'testSuccessPass'
        };

        // mock backend & ensure it gets called
        $httpBackend.expectGET("/poc_config/openmrs/i18n/common/locale_en.json")
                .respond({
                    data: window.__fixtures__['local_en']
                });

        ctrl.login();
        scope.$apply();

        expect(sessionService.getSession).toHaveBeenCalled();
        expect(location.path).toHaveBeenCalledWith('/dashboard');
    });

    it('should stay on page and set $scope.errorMessage on invalid user/pass', function () {
        spyOn(sessionService, 'loadCredentials').and.callThrough();

        // construct controller
        var ctrl = controller('LoginController', {
            $scope: scope,
            $location: location,
            sessionService: sessionService
        });

        scope.loginUser = {
            username: 'testFailureUser',
            password: 'testFailurePass'
        };

        // mock backend & ensure it gets called
        $httpBackend.expectGET("/poc_config/openmrs/i18n/common/locale_en.json")
                .respond({
                    data: window.__fixtures__['local_en']
                });

        // perform login
        ctrl.login();
        scope.$apply();

        expect(sessionService.getSession).toHaveBeenCalled();
        expect(sessionService.loadCredentials).not.toHaveBeenCalled();
        expect(location.path).not.toHaveBeenCalledWith('/dashboard');
        expect(ctrl.errorMessageTranslateKey).toEqual('invalid username or password');
    });

    it('should stay on page and set $scope.errorMessage on failure to load credentiala', function () {
        // construct controller
        var ctrl = controller('LoginController', {
            $scope: scope,
            $location: location,
            sessionService: sessionService
        });

        // mock sessionService.loadCredentials (failure)
        spyOn(sessionService, 'loadCredentials').and.callFake(function () {
            return q.reject('failure to load credentials');
        });

        scope.loginUser = {
            username: 'testSuccessUser',
            password: 'testSuccessPass'
        };

        $httpBackend.expectGET("/poc_config/openmrs/i18n/common/locale_en.json")
                .respond({
                    data: window.__fixtures__['local_en']
                });

        // perform login
        ctrl.login();
        scope.$apply();

        expect(sessionService.getSession).toHaveBeenCalled();
        expect(location.path).not.toHaveBeenCalledWith('/dashboard');
        expect(ctrl.errorMessageTranslateKey).toEqual('failure to load credentials');
    });

    it('should redirect to the landing page if we are already logged in', function () {
        // mock sessionService.getSession
        sessionService.getSession.and.returnValue({
            then: function (callback) {
                var data = {};
                data.authenticated = true;
                callback(data);
            }
        });

        // construct controller
        controller('LoginController', {
            $scope: scope,
            $location: location,
            sessionService: sessionService
        });

        // mock sessionService.loadCredentials
        spyOn(sessionService, 'loadCredentials').and.returnValue(q.when({}));

        expect(sessionService.getSession).toHaveBeenCalled();
        expect(location.path).toHaveBeenCalledWith('/dashboard');
    });

    it('should show session expired message if indicated by state', function () {
        stateParams.showLoginMessage = 'LOGIN_LABEL_LOGIN_ERROR_MESSAGE_KEY';

        // construct controller
        var ctrl = controller('LoginController', {
            $scope: scope,
            $location: location,
            sessionService: sessionService
        });

        expect(ctrl.errorMessageTranslateKey).toEqual('LOGIN_LABEL_LOGIN_ERROR_MESSAGE_KEY');
    });
});
