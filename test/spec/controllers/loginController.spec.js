describe('Controller: LoginController', function() {
  var scope, q, controller, location, sessionService, stateParams, mockLocaleService, $httpBackend;

  beforeEach(module('home'));

  beforeEach(inject(function($controller, $rootScope, _$location_, _sessionService_, $q, $stateParams, localeService, _$httpBackend_) {
    scope = $rootScope.$new();
    q = $q;
    location = _$location_;
    controller = $controller;
    stateParams = $stateParams;
    sessionService = _sessionService_;
    mockLocaleService = localeService;
    $httpBackend = _$httpBackend_;

    // mock sessionService.loginUser
    spyOn(sessionService, 'loginUser').and.callFake(function(testUser) {
      var defer = $q.defer();

      if (testUser === 'testSuccessUser') {
        defer.resolve();
      } else {
        defer.reject('invalid username or password');
      }

      return defer.promise;
    });

    // mock sessionService.get
    spyOn(sessionService, 'get').and.callFake(function() {
      return {
        success: function(callback) {
          var data = {};
          data.authenticated = false;
          callback(data);
        }
      };
    });

    // mock localService
    spyOn(mockLocaleService, 'allowedLocalesList').and.callFake(function() {
      var defer = $q.defer();

      defer.resolve({
        data: 'en, es, fr, it, pt'
      });

      return defer.promise;
    });

    location.path('/login');
    spyOn(location, 'path').and.callThrough();
  }));

  it('should redirect the user to the landing page on successful login', function() {
    // construct controller
    controller('LoginController', {
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
    $httpBackend.expectGET("../i18n/home/locale_en.json")
      .respond({
        data: window.__fixtures__['local_en']
      });

    scope.login();
    scope.$apply();

    expect(sessionService.get).toHaveBeenCalled();
    expect(location.path).toHaveBeenCalledWith('/dashboard');
    expect(mockLocaleService.allowedLocalesList).toHaveBeenCalled();
  });

  it('should stay on page and set $scope.errorMessage on invalid user/pass', function() {
    spyOn(sessionService, 'loadCredentials').and.callThrough();

    // construct controller
    controller('LoginController', {
      $scope: scope,
      $location: location,
      sessionService: sessionService
    });

    scope.loginUser = {
      username: 'testFailureUser',
      password: 'testFailurePass'
    };

    // mock backend & ensure it gets called
    $httpBackend.expectGET("../i18n/home/locale_en.json")
      .respond({
        data: window.__fixtures__['local_en']
      });

    // perform login
    scope.login();
    scope.$apply();

    expect(sessionService.get).toHaveBeenCalled();
    expect(sessionService.loadCredentials).not.toHaveBeenCalled();
    expect(location.path).not.toHaveBeenCalledWith('/dashboard');
    expect(scope.errorMessageTranslateKey).toEqual('invalid username or password');
  });

  it('should stay on page and set $scope.errorMessage on failure to load credentiala', function() {
    // construct controller
    controller('LoginController', {
      $scope: scope,
      $location: location,
      sessionService: sessionService
    });

    // mock sessionService.loadCredentials (failure)
    spyOn(sessionService, 'loadCredentials').and.callFake(function() {
      return q.reject('failure to load credentials');
    });

    scope.loginUser = {
      username: 'testSuccessUser',
      password: 'testSuccessPass'
    };

    $httpBackend.expectGET("../i18n/home/locale_en.json")
      .respond({
        data: window.__fixtures__['local_en']
      });

    // perform login
    scope.login();
    scope.$apply();

    expect(sessionService.get).toHaveBeenCalled();
    expect(location.path).not.toHaveBeenCalledWith('/dashboard');
    expect(scope.errorMessageTranslateKey).toEqual('failure to load credentials');
  });

  it('should redirect to the landing page if we are already logged in', function() {
    // mock sessionService.get
    sessionService.get.and.returnValue({
      success: function(callback) {
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

    expect(sessionService.get).toHaveBeenCalled();
    expect(location.path).toHaveBeenCalledWith('/dashboard');
  });

  it('should show session expired message if indicated by state', function() {
    stateParams.showLoginMessage = true;

    // construct controller
    controller('LoginController', {
      $scope: scope,
      $location: location,
      sessionService: sessionService
    });

    expect(scope.errorMessageTranslateKey).toEqual('LOGIN_LABEL_LOGIN_ERROR_MESSAGE_KEY');
  });
});
