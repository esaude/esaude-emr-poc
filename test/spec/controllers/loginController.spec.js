describe('Controller: LoginController', function () {
    var $rootScope, $q, controller, $location, sessionService, stateParams, mockLocaleService, $httpBackend, $window;

    beforeEach(module('home',function ($provide, $translateProvider, $urlRouterProvider) {
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

    beforeEach(inject(function ($controller, _$rootScope_, _$location_, _sessionService_, _$q_, $stateParams, localeService, _$httpBackend_) {
        $rootScope = _$rootScope_;
        $q = _$q_;
        $location = _$location_;
        controller = $controller;
        stateParams = $stateParams;
        sessionService = _sessionService_;
        mockLocaleService = localeService;
        $httpBackend = _$httpBackend_;
    }));

    beforeEach(function () {
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

      spyOn(sessionService, 'setLocale').and.callFake(function () {
        return $q(function (resolve) {
          return resolve();
        });
      });

      $location.path('/login');
      spyOn($location, 'path').and.callThrough();
    });


    describe('activate', function () {
      it('should set selected locale on session', function () {
        var ctrl = controller('LoginController', {
          $scope: {}
        });
        expect(sessionService.setLocale).toHaveBeenCalled();
      });
    });

    describe('login', function () {

      it('should redirect the user to the landing page on successful login', function () {
        // construct controller
        var ctrl = controller('LoginController', {
          $scope: $rootScope,
          $location: $location,
          sessionService: sessionService
        });

        // mock sessionService.loadCredentials (success)
        spyOn(sessionService, 'loadCredentials').and.returnValue($q.when({}));

        ctrl.loginUser = {
          username: 'testSuccessUser',
          password: 'testSuccessPass'
        };


        ctrl.login();
        $rootScope.$apply();

        expect(sessionService.getSession).toHaveBeenCalled();
        expect($location.path).toHaveBeenCalledWith('/dashboard');
      });

      it('should stay on page and set $scope.errorMessage on invalid user/pass', function () {

        var ctrl = controller('LoginController', {
          $scope: {},
          $location: $location,
          sessionService: sessionService
        });

        ctrl.loginUser = {
          username: 'testFailureUser',
          password: 'testFailurePass'
        };

        ctrl.login();

        $rootScope.$apply();
        expect($location.path).not.toHaveBeenCalledWith('/dashboard');
        expect(ctrl.errorMessageTranslateKey).toEqual('invalid username or password');
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
          $scope: $rootScope,
          $location: $location,
          sessionService: sessionService
        });

        // mock sessionService.loadCredentials
        spyOn(sessionService, 'loadCredentials').and.returnValue($q.when({}));

        expect(sessionService.getSession).toHaveBeenCalled();
        expect($location.path).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should show session expired message if indicated by state', function () {
        stateParams.showLoginMessage = 'LOGIN_LABEL_LOGIN_ERROR_MESSAGE_KEY';

        // construct controller
        var ctrl = controller('LoginController', {
            $scope: $rootScope,
            $location: $location,
            sessionService: sessionService
        });

        expect(ctrl.errorMessageTranslateKey).toEqual('LOGIN_LABEL_LOGIN_ERROR_MESSAGE_KEY');
    });
});
