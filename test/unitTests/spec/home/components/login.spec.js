describe('login', () => {

  var $rootScope, $q, $componentController, $location, sessionService, stateParams, mockLocaleService, $httpBackend,
    $window;

  beforeEach(module('home', ($provide, $translateProvider, $urlRouterProvider) => {
    $provide.factory('mergeLocaleFilesService', $q => () => {
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    });
    $translateProvider.useLoader('mergeLocaleFilesService');
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject((_$componentController_, _$rootScope_, _$location_, _sessionService_, _$q_, $stateParams, localeService, _$httpBackend_) => {
    $rootScope = _$rootScope_;
    $q = _$q_;
    $location = _$location_;
    $componentController = _$componentController_;
    stateParams = $stateParams;
    sessionService = _sessionService_;
    mockLocaleService = localeService;
    $httpBackend = _$httpBackend_;
  }));

  beforeEach(() => {
    // mock sessionService.loginUser
    spyOn(sessionService, 'loginUser').and.callFake(testUser => {
      var defer = $q.defer();

      if (testUser === 'testSuccessUser') {
        defer.resolve();
      } else {
        defer.reject('invalid username or password');
      }

      return defer.promise;
    });

    // mock sessionService.getSession
    spyOn(sessionService, 'getSession').and.callFake(() => ({
      then: callback => {
        var data = {};
        data.authenticated = false;
        callback(data);
      }
    }));

    // mock localService
    spyOn(mockLocaleService, 'allowedLocalesList').and.callFake(() => {
      var defer = $q.defer();

      defer.resolve({
        data: 'en, es, fr, it, pt'
      });

      return defer.promise;
    });

    spyOn(sessionService, 'setLocale').and.callFake(() => $q(resolve => resolve()));

    $location.path('/login');
    spyOn($location, 'path').and.callThrough();
  });


  describe('$onInit', () => {

    it('should set selected locale on session', () => {

      var ctrl = $componentController('login');

      ctrl.$onInit();

      expect(sessionService.setLocale).toHaveBeenCalled();
    });

    it('should redirect to the landing page if we are already logged in', () => {
      // mock sessionService.getSession
      sessionService.getSession.and.returnValue({
        then: callback => {
          var data = {};
          data.authenticated = true;
          callback(data);
        }
      });

      // construct controller
      var ctrl = $componentController('login');

      ctrl.$onInit();

      // mock sessionService.loadCredentials
      spyOn(sessionService, 'loadCredentials').and.returnValue($q.when({}));

      expect(sessionService.getSession).toHaveBeenCalled();
      expect($location.path).toHaveBeenCalledWith('/dashboard');
    });

    it('should show session expired message if indicated by state', () => {
      stateParams.showLoginMessage = 'LOGIN_LABEL_LOGIN_ERROR_MESSAGE_KEY';

      // construct controller
      var ctrl = $componentController('login');

      ctrl.$onInit();

      expect(ctrl.errorMessageTranslateKey).toEqual('LOGIN_LABEL_LOGIN_ERROR_MESSAGE_KEY');
    });

  });

  describe('login', () => {

    it('should redirect the user to the landing page on successful login', () => {
      // construct controller
      var ctrl = $componentController('login');

      // mock sessionService.loadCredentials (success)
      spyOn(sessionService, 'loadCredentials').and.returnValue($q.when({}));

      ctrl.loginUser = {
        username: 'testSuccessUser',
        password: 'testSuccessPass'
      };


      ctrl.login();
      $rootScope.$apply();

      expect(sessionService.loginUser).toHaveBeenCalled();
      expect($location.path).toHaveBeenCalledWith('/dashboard');
    });

    it('should stay on page and set $scope.errorMessage on invalid user/pass', () => {

      var ctrl = $componentController('login');

      ctrl.loginUser = {
        username: 'testFailureUser',
        password: 'testFailurePass'
      };

      ctrl.login();

      $rootScope.$apply();
      expect($location.path).not.toHaveBeenCalledWith('/dashboard');
      expect(ctrl.errorMessageTranslateKey).toEqual('invalid username or password');
    });
  });
});
